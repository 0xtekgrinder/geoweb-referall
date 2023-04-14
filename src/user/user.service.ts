import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import UserCreateDto from './dto/UserCreate.dto';
import UserUpdateDto from './dto/UserUpdate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByAddress(address: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ address });
  }

  async deleteById(id: string) {
    return await this.userRepository.delete({ id });
  }

  async create(user: UserCreateDto) {
    return await this.userRepository.save(user);
  }

  async update(id: string, newUser: UserUpdateDto) {
    return await this.userRepository.update({ id }, newUser);
  }
}
