import { IsNotEmpty, IsString } from 'class-validator';

export default class TransactionCreateDto {
  @IsNotEmpty()
  @IsString()
  txHash: string;

  @IsNotEmpty()
  @IsString()
  referralId: string;
}
