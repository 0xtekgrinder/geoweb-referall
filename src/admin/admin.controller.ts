import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import UserCreateDto from 'src/user/dto/UserCreate.dto';
import UserUpdateDto from 'src/user/dto/UserUpdate.dto';
import { UserService } from 'src/user/user.service';

@Controller({ path: 'admin', host: 'private' })
export class AdminController {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Post('user/create')
  async createUser(@Body() user: UserCreateDto) {
    return this.userService.create(user);
  }

  @Put('user/update/:id')
  async updateUser(@Body() user: UserUpdateDto, @Param('id') id: string) {
    return this.userService.update(id, user);
  }

  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    const user = this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('user/address/:address')
  async getUserByAddress(@Param('address') address: string) {
    const user = this.userService.findOneByAddress(address);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }

  @Get('transactions')
  async getTransactions() {
    return this.transactionService.findAll();
  }

  @Get('transaction/:referralId')
  async getTransaction(@Param('referralId') referralId: string) {
    return this.transactionService.findAllByReferralId(referralId);
  }

  @Get('transactions/txHash/:txHash')
  async getTransactionByTxHash(@Param('txHash') txHash: string) {
    const transaction = this.transactionService.findOneByTxHash(txHash);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Delete('transaction/:txHash')
  async deleteTransaction(@Param('txHash') txHash: string) {
    return this.transactionService.deleteByTxHash(txHash);
  }

  @Delete('transactions/:referralId')
  async deleteTransactions(@Param('referralId') referralId: string) {
    return this.transactionService.deleteByReferralId(referralId);
  }
}
