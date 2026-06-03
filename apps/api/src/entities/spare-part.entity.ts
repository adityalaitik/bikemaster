import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('spare_parts')
export class SparePartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'garage_id' })
  garageId: string;

  @Column({ name: 'part_name' })
  partName: string;

  @Column({ name: 'part_number' })
  partNumber: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId: string;

  @Column({ name: 'compatible_brand', nullable: true })
  compatibleBrand: string;

  @Column({ name: 'compatible_model', nullable: true })
  compatibleModel: string;

  @Column({ name: 'compatible_variant', nullable: true })
  compatibleVariant: string;

  @Column({ name: 'part_brand', nullable: true })
  partBrand: string;

  @Column({ name: 'bin_location', nullable: true, default: 'Storage' })
  binLocation: string;

  @Column({ name: 'hsn_code', nullable: true })
  hsnCode: string;

  @Column({ default: 'PCS' })
  unit: string;

  @Column({ name: 'tax_category_id', nullable: true })
  taxCategoryId: string;

  @Column({ name: 'reorder_level', default: 5 })
  reorderLevel: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
