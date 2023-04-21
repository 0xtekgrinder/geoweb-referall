import { PartialType } from '@nestjs/swagger';
import UserCreateDto from './User.dto';

export default class UserUpdateDto extends PartialType(UserCreateDto) {}
