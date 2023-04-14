import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AdminController],
  imports: [TransactionModule, UserModule],
})
export class AdminModule {}
