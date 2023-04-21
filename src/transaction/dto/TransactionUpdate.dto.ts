import { PartialType } from '@nestjs/swagger';
import TransactionCreateDto from './Transaction.dto';

export default class TransactionUpdateDto extends PartialType(
  TransactionCreateDto,
) {}
