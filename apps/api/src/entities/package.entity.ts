import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column({ name: 'package_name' })
  packageName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'validity_days', nullable: true })
  validityDays: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
