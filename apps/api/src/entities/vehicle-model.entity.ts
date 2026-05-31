import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vehicle_models')
export class VehicleModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'brand_id', type: 'char', length: 36 })
  brandId: string;

  @Column()
  name: string;

  @Column({
    name: 'fuel_type',
    type: 'enum',
    enum: ['petrol', 'diesel', 'electric', 'cng', 'hybrid'],
    default: 'petrol',
  })
  fuelType: string;

  @Column({
    name: 'vehicle_type',
    type: 'enum',
    enum: ['two_wheeler', 'three_wheeler', 'four_wheeler', 'commercial'],
    default: 'two_wheeler',
  })
  vehicleType: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
