import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class TxHashDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  txHash: string;
}
