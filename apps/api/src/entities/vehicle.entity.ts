import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'registration_no' })
  registrationNo: string;

  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @Column({ name: 'model_id', type: 'char', length: 36 })
  modelId: string;

  @Column({ name: 'variant_id', type: 'char', length: 36, nullable: true })
  variantId: string;

  @Column({ name: 'category_id', type: 'char', length: 36, nullable: true })
  categoryId: string;

  @Column({
    name: 'number_plate_color',
    type: 'enum',
    enum: ['white', 'yellow', 'green', 'black', 'blue'],
    default: 'white',
  })
  numberPlateColor: string;

  @Column({ name: 'chassis_no', nullable: true })
  chassisNo: string;

  @Column({ name: 'engine_no', nullable: true })
  engineNo: string;

  @Column({ name: 'mfg_year', type: 'smallint', nullable: true })
  mfgYear: number;

  @Column({ name: 'date_of_registration', type: 'date', nullable: true })
  dateOfRegistration: Date;

  @Column({ nullable: true })
  color: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
