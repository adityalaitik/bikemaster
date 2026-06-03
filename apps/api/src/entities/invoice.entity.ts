import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_no', unique: true })
  invoiceNo: string;

  @Column({ name: 'job_card_id', type: 'char', length: 36, nullable: true })
  jobCardId: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column({ name: 'customer_id', type: 'char', length: 36 })
  customerId: string;

  @Column({
    name: 'invoice_type',
    type: 'enum',
    enum: ['tax_invoice', 'estimate', 'counter_sale'],
    default: 'estimate',
  })
  invoiceType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'customer_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  customerAmount: number;

  @Column({ name: 'insurance_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  insuranceAmount: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'paid', 'partial', 'cancelled'],
    default: 'draft',
  })
  status: string;

  @Column({ name: 'pdf_url', type: 'text', nullable: true })
  pdfUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
