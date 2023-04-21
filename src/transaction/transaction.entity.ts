import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn()
  txHash: string;

  @Column()
  referralId: string;
}
