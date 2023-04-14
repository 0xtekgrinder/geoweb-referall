import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn()
  txHash: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  referralId: string;
}
