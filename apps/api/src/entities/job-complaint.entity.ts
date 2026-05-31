import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('job_complaints')
export class JobComplaintEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_card_id', type: 'char', length: 36 })
  jobCardId: string;

  @Column({ name: 'complaint_text', type: 'text' })
  complaintText: string;

  @Column({ name: 'workshop_finding', type: 'text', nullable: true })
  workshopFinding: string;

  @Column({
    type: 'enum',
    enum: ['repair_now', 'repair_later', 'inform_customer', 'monitor', 'rejected'],
    default: 'repair_now',
  })
  action: string;

  @Column({ name: 'is_rejected', default: false })
  isRejected: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
