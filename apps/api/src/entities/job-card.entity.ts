import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('job_cards')
export class JobCardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_card_no' })
  jobCardNo: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column({ name: 'vehicle_id', type: 'char', length: 36 })
  vehicleId: string;

  @Column({ name: 'customer_id', type: 'char', length: 36 })
  customerId: string;

  @Column({ name: 'service_advisor_id', type: 'char', length: 36, nullable: true })
  serviceAdvisorId: string;

  @Column({ name: 'odometer_in' })
  odometerIn: number;

  @Column({ name: 'odometer_out', nullable: true })
  odometerOut: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'under_servicing', 'next_day_delivery', 'upcoming_delivery', 'ready_for_delivery', 'payment_processing', 'completed', 'deleted'],
    default: 'draft',
  })
  status: string;

  @Column({
    name: 'service_type',
    type: 'enum',
    enum: ['regular', 'accidental', 'insurance_claim', 'express', 'free_service'],
    default: 'regular',
  })
  serviceType: string;

  @CreateDateColumn({ name: 'date_of_arrival' })
  dateOfArrival: Date;

  @Column({ name: 'promised_delivery_date', nullable: true })
  promisedDeliveryDate: Date;

  @Column({ name: 'actual_delivery_date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ name: 'customer_complaints', type: 'text', nullable: true })
  customerComplaints: string;

  @Column({ name: 'workshop_findings', type: 'text', nullable: true })
  workshopFindings: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'customer_notes', type: 'text', nullable: true })
  customerNotes: string;

  @Column({ name: 'gate_pass_no', nullable: true })
  gatePassNo: string;

  @Column({ name: 'gate_pass_issued_at', nullable: true })
  gatePassIssuedAt: Date;

  @Column({ type: 'tinyint', nullable: true })
  rating: number;

  @Column({ name: 'rating_feedback', type: 'text', nullable: true })
  ratingFeedback: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
