import { IsNotEmpty, IsString } from 'class-validator';

export default class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
