import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customer_sources')
export class CustomerSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column()
  name: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
