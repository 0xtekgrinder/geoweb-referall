import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import TransactionCreateDto from './dto/TransactionCreate.dto';
import TransactionUpdateDto from './dto/TransactionUpdate.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findAll(): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find();
  }

  async findOneByTxHash(txHash: string): Promise<TransactionEntity> {
    return await this.transactionRepository.findOneBy({ txHash });
  }

  async findAllByReferralId(referralId: string): Promise<TransactionEntity[]> {
    return await this.transactionRepository.findBy({ referralId });
  }

  async deleteByTxHash(txHash: string) {
    return await this.transactionRepository.delete({ txHash });
  }

  async deleteAllByReferralId(referralId: string) {
    return await this.transactionRepository.delete({ referralId });
  }

  async create(transaction: TransactionCreateDto) {
    return await this.transactionRepository.save(transaction);
  }

  async update(txHash: string, newTransaction: TransactionUpdateDto) {
    return await this.transactionRepository.update({ txHash }, newTransaction);
  }
}
