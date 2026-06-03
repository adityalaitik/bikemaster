import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id' })
  garageId: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_code' })
  serviceCode: string;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'hsn_sac_code', nullable: true })
  hsnSacCode: string;

  @Column({ name: 'default_rate', type: 'decimal', precision: 10, scale: 2, default: 0 })
  defaultRate: number;

  @Column({ name: 'tax_category_id', nullable: true })
  taxCategoryId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
