import { Body, Controller, Logger, Post } from '@nestjs/common';
import { TransactionService } from './transaction/transaction.service';
import TransactionCreateDto from './transaction/dto/TransactionCreate.dto';

@Controller({ host: 'public' })
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private transactionService: TransactionService) {}

  @Post('submit')
  async submit(@Body() transaction: TransactionCreateDto) {
    this.logger.log(`Received transaction: ${JSON.stringify(transaction)}`);
    return this.transactionService.create(transaction);
  }
}
