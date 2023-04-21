import {
  Controller,
  Logger,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionService } from './transaction/transaction.service';
import * as ucans from '@ucans/ucans';
import { ConfigService } from '@nestjs/config';

@Controller({ host: 'public' })
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private transactionService: TransactionService,
    private configService: ConfigService,
  ) {}

  @Post('submit')
  async submit(@Headers() headers: Record<string, string>) {
    if (!headers.jwt) {
      throw new UnauthorizedException('No JWT provided');
    }
    if (!headers.ucan) {
      throw new UnauthorizedException('No UCAN provided');
    }

    // const pkhDidResolver = import('pkh-did-resolver');
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
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const provider = import('ethers').then(
      (ethers) =>
        new ethers.ethers.JsonRpcProvider(
          this.configService.get<string>('RPC_URL'),
        ),
    );

    const transaction = await (
      await provider
    ).getTransaction(parsedJWS.payload.txHash);

    if (!transaction) {
      throw new UnauthorizedException('Invalid transaction hash');
    }

    // TODO check if transaction is from the user

    const result = await ucans.verify(headers.ucan, {
      audience: parsedJWS.kid,
      requiredCapabilities: [
        {
          capability: {
            with: {
              scheme: 'https://geoweb.network/claim/did:pkh',
              hierPart: `eip155:${this.configService.get<string>('CHAIN_ID')}:${
                transaction.from
              }`,
            },
            can: { namespace: 'http', segments: ['post'] },
          },
          rootIssuer: this.configService.get<string>('ROOT_ISSUER'),
        },
      ],
    });

    if (!result.ok) {
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
