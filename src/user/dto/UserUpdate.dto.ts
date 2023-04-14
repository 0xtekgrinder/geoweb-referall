import { PartialType } from '@nestjs/mapped-types';
import UserCreateDto from './UserCreate.dto';

export default class UserUpdateDto extends PartialType(UserCreateDto) {}
