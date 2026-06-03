import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'offer_type',
    type: 'enum',
    enum: ['percentage', 'fixed', 'free_service', 'free_part'],
  })
  offerType: string;

  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ name: 'applicable_to', default: 'all' })
  applicableTo: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
