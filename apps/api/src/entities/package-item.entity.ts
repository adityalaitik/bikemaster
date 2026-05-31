import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('package_items')
export class PackageItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'package_id', type: 'char', length: 36 })
  packageId: string;

  @Column({ name: 'item_type', type: 'enum', enum: ['spare', 'service'] })
  itemType: string;

  @Column({ name: 'spare_part_id', type: 'char', length: 36, nullable: true })
  sparePartId: string;

  @Column({ name: 'service_id', type: 'char', length: 36, nullable: true })
  serviceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number;
}
