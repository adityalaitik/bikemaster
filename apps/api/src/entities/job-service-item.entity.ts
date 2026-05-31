import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('job_service_items')
export class JobServiceItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_card_id' })
  jobCardId: string;

  @Column({ name: 'service_id', nullable: true })
  serviceId: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_code' })
  serviceCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number;

  @Column({ name: 'billed_to', default: 'customer' })
  billedTo: string;

  @Column({ default: 'estimated' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
