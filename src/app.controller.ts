import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction/transaction.service';
import TransactionCreateDto from './transaction/dto/TransactionCreate.dto';

@Controller({ host: 'public' })
export class AppController {
  constructor(private transactionService: TransactionService) {}

  @Post('submit')
  async submit(@Body() transaction: TransactionCreateDto) {
    return this.transactionService.create(transaction);
  }
}
