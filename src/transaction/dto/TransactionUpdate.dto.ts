import { PartialType } from '@nestjs/mapped-types';
import TransactionCreateDto from './TransactionCreate.dto';

export default class TransactionUpdateDto extends PartialType(
  TransactionCreateDto,
) {}
