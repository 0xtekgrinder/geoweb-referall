import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class IdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
}
