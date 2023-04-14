import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class TransactionEntity {
  @PrimaryColumn()
  txHash: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  referralId: string;
}
