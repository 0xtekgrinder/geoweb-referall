import {
  Controller,
  Logger,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionService } from './transaction/transaction.service';
import * as ucans from '@ucans/ucans';

@Controller({ host: 'public' })
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private transactionService: TransactionService) {}

  @Post('submit')
  async submit(@Headers() headers: Record<string, string>) {
    if (!headers.jwt) {
      throw new UnauthorizedException('No JWT provided');
    }
    if (!headers.ucan) {
      throw new UnauthorizedException('No UCAN provided');
    }

    const dagJose = await import('dag-jose');
    const decodedJwt = dagJose.decode(Buffer.from(headers.jwt));
    console.log(decodedJwt);

    // const parsed = JSON.parse(decodedJwt.payload);
    // console.log(parsed);
// 
    // // ucans.verify(headers.ucan, {})
    // return this.transactionService.create({
    //   referralId: parsed.referralId,
    //   txHash: parsed.txHash,
    // });
  }
}
