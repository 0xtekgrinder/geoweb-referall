import {
  Controller,
  Logger,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiHeaders,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransactionService } from './transaction/transaction.service';
import * as ucans from '@ucans/ucans';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { TransactionEntity } from './transaction/transaction.entity';
import TransactionDto from './transaction/dto/Transaction.dto';
import {
  IRegistryDiamondABI,
  getContractAddressesForChainOrThrow,
} from '@geo-web/sdk';

@Controller({ host: 'public' })
@ApiTags('App')
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private transactionService: TransactionService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  @Post('claim')
  @ApiOperation({
    summary: 'Claim a transaction by a referral',
  })
  @ApiHeaders([
    {
      name: 'jwt',
      description:
        'A signed JWT containing the transaction hash and the referral ID',
      required: true,
    },
    {
      name: 'ucan',
      description:
        'A ucan containing the capability to post to this endpoint with ',
      required: true,
    },
  ])
  @ApiCreatedResponse({
    description: 'The transaction was successfully claimed',
    type: TransactionDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The JWT or UCAN was invalid',
  })
  async claim(
    @Headers() headers: Record<string, string>,
  ): Promise<TransactionEntity> {
    if (!headers.jwt) {
      this.logger.log('No JWT provided');
      throw new UnauthorizedException('No JWT provided');
    }
    if (!headers.ucan) {
      this.logger.log('No UCAN provided');
      throw new UnauthorizedException('No UCAN provided');
    }

    this.logger.log('Trying to verify JWT and UCAN', headers.jwt, headers.ucan);

    const keyDidResolver = import('key-did-resolver');

    const dids = await import('dids');
    const did = new dids.DID({
      resolver: (await keyDidResolver).getResolver(),
    });

    const parsedJWS = await did.verifyJWS(JSON.parse(headers.jwt));

    if (
      !parsedJWS.payload ||
      !parsedJWS.payload.txHash ||
      !parsedJWS.payload.referralId
    ) {
      this.logger.log('Invalid JWT payload', parsedJWS.payload);
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.userService.findOneById(
      parsedJWS.payload.referralId,
    );
    if (!user) {
      this.logger.log('Invalid referral ID', parsedJWS.payload.referralId);
      throw new UnauthorizedException('Invalid referral ID');
    }

    const chainId = this.configService.get<number>('CHAIN_ID');
    const ethers = await import('ethers');
    const rpcUrl = this.configService.get<string>('RPC_URL');

    const provider = new ethers.ethers.JsonRpcProvider(rpcUrl);

    const { registryDiamond } = getContractAddressesForChainOrThrow(chainId);
    const registry = new ethers.ethers.Contract(
      registryDiamond,
      IRegistryDiamondABI,
      provider,
    );
    const topic = registry.interface.getEvent('ParcelClaimedV2').topicHash;

    const transaction = await provider.getTransaction(parsedJWS.payload.txHash);
    const receipt = await transaction.wait();

    if (!transaction) {
      this.logger.log('Invalid transaction hash', parsedJWS.payload.txHash);
      throw new UnauthorizedException('Invalid transaction hash');
    }

    if (!receipt) {
      this.logger.log('Invalid transaction receipt', parsedJWS.payload.txHash);
      throw new UnauthorizedException('Invalid transaction receipt');
    }

    let found = false;
    for (const log of receipt.logs) {
      if (log.topics[0] === topic && log.address === registryDiamond) {
        found = true;
      }
    }
    if (!found) {
      this.logger.log(
        `Transaction doesn't emit ParcelClaimedV2`,
        parsedJWS.payload.txHash,
      );
      throw new UnauthorizedException(
        `Transaction doesn't emit ParcelClaimedV2`,
      );
    }

    const result = await ucans.verify(headers.ucan, {
      audience: parsedJWS.didResolutionResult.didDocument.id,
      requiredCapabilities: [
        {
          capability: {
            with: {
              scheme: 'https',
              hierPart: `//geoweb.network/claim/did:pkh:eip155:${chainId}:${transaction.from}`,
            },
            can: { namespace: 'http', segments: ['post'] },
          },
          rootIssuer: this.configService.get<string>('ROOT_ISSUER'),
        },
      ],
    });

    if (!result.ok) {
      this.logger.log('Invalid UCAN', result);
      throw new UnauthorizedException('Invalid UCAN');
    }

    this.logger.log(
      `Transaction ${parsedJWS.payload.txHash} from ${transaction.from} for referral ${parsedJWS.payload.referralId} was successfully verified`,
    );

    return this.transactionService.create({
      referralId: parsedJWS.payload.referralId,
      txHash: parsedJWS.payload.txHash,
    });
  }
}
