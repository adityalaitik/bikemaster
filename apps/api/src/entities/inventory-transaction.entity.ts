import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inventory_transactions')
export class InventoryTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spare_part_id' })
  sparePartId: string;

  @Column({ name: 'garage_id' })
  garageId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: ['purchase', 'issue', 'return', 'transfer_in', 'transfer_out', 'adjustment'],
  })
  transactionType: 'purchase' | 'issue' | 'return' | 'transfer_in' | 'transfer_out' | 'adjustment';

  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: ['job_card', 'counter_sale', 'transfer', 'adjustment'],
  })
  referenceType: 'job_card' | 'counter_sale' | 'transfer' | 'adjustment';

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
