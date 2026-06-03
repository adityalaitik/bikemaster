import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36, nullable: true })
  userId: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column({ name: 'designation_id', type: 'char', length: 36, nullable: true })
  designationId: string;

  @Column({ name: 'employee_code' })
  employeeCode: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: ['technician', 'supervisor', 'service_advisor'] })
  type: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
