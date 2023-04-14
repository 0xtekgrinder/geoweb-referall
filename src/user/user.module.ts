import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
})
export class UserModule {}
