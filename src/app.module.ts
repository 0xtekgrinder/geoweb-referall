import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { TransactionEntity } from './transaction/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          synchronize: true,
          entities: [UserEntity, TransactionEntity],
        };
      },
    }),
    TransactionModule,
    AdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
