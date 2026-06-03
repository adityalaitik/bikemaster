import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vehicle_brands')
export class VehicleBrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @Column()
  name: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
