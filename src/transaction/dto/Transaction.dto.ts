import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class TransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  txHash: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  referralId: string;
}
