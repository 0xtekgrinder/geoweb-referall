import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class ReferralIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  referralId: string;
}
