import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('job_spare_items')
export class JobSpareItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_card_id' })
  jobCardId: string;

  @Column({ name: 'spare_part_id', nullable: true })
  sparePartId: string;

  @Column({ name: 'part_name' })
  partName: string;

  @Column({ name: 'part_number' })
  partNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  mrp: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'billed_to', default: 'customer' })
  billedTo: string;

  @Column({ default: 'estimated' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
