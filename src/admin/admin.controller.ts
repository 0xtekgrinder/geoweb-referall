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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionService } from 'src/transaction/transaction.service';
import UserDto from 'src/user/dto/User.dto';
import UserUpdateDto from 'src/user/dto/UserUpdate.dto';
import { UserService } from 'src/user/user.service';
import ReferralIdDto from './dto/ReferralId.dto';
import TxHashDto from './dto/TxHash.dto';
import IdDto from './dto/Id.dto';
import { UserEntity } from 'src/user/user.entity';
import { TransactionEntity } from 'src/transaction/transaction.entity';
import TransactionDto from 'src/transaction/dto/Transaction.dto';

@Controller({ path: 'admin', host: 'private' })
@ApiTags('Admin')
export class AdminController {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Post('user')
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    description: 'The user was successfully created',
    type: UserDto,
  })
  async createUser(@Body() user: UserDto): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @Put('user/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({
    description: 'The user was successfully updated',
  })
  async updateUser(@Body() user: UserUpdateDto, @Param() params: IdDto) {
    return this.userService.update(params.id, user);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'The users were successfully retrieved',
    type: [UserDto],
  })
  async getUsers(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    description: 'The user was successfully retrieved',
    type: UserDto,
  })
  async getUser(@Param() params: IdDto): Promise<UserEntity> {
    const user = this.userService.findOneById(params.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({
    description: 'The user was successfully deleted',
  })
  async deleteUser(@Param() params: IdDto) {
    return this.userService.deleteById(params.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({
    description: 'The transactions were successfully retrieved',
    type: [TransactionDto],
  })
  async getTransactions(): Promise<TransactionEntity[]> {
    return this.transactionService.findAll();
  }

  @Get('transactions/:referralId')
  @ApiOperation({ summary: 'Get all transactions by referralId' })
  @ApiOkResponse({
    description: 'The transactions were successfully retrieved',
    type: [TransactionDto],
  })
  async getTransaction(
    @Param() params: ReferralIdDto,
  ): Promise<TransactionEntity[]> {
    return this.transactionService.findAllByReferralId(params.referralId);
  }

  @Get('transactions/txHash/:txHash')
  @ApiOperation({ summary: 'Get transaction by txHash' })
  @ApiOkResponse({
    description: 'The transaction was successfully retrieved',
    type: TransactionDto,
  })
  async getTransactionByTxHash(
    @Param() params: TxHashDto,
  ): Promise<TransactionEntity> {
    const transaction = this.transactionService.findOneByTxHash(params.txHash);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Delete('transaction/:txHash')
  @ApiOperation({ summary: 'Delete transaction by txHash' })
  @ApiOkResponse({
    description: 'The transaction was successfully deleted',
  })
  async deleteTransaction(@Param() params: TxHashDto) {
    return this.transactionService.deleteByTxHash(params.txHash);
  }

  @Delete('transactions/:referralId')
  @ApiOperation({ summary: 'Delete all transactions by referralId' })
  @ApiOkResponse({
    description: 'The transactions were successfully deleted',
  })
  async deleteTransactions(@Param() params: ReferralIdDto) {
    return this.transactionService.deleteByReferralId(params.referralId);
  }
}
