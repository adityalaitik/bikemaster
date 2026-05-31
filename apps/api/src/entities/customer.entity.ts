import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ name: 'alternate_phone', nullable: true })
  alternatePhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  gstin: string;

  @Column({
    name: 'customer_type',
    type: 'enum',
    enum: ['individual', 'corporate'],
    default: 'individual',
  })
  customerType: string;

  @Column({ name: 'source_id', type: 'char', length: 36, nullable: true })
  sourceId: string;

  @Column({ name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
