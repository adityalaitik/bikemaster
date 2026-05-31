import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inventory_batches')
export class InventoryBatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spare_part_id', type: 'char', length: 36 })
  sparePartId: string;

  @Column({ name: 'garage_id', type: 'char', length: 36 })
  garageId: string;

  @Column({ name: 'batch_no' })
  batchNo: string;

  @Column({ name: 'purchase_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  mrp: number;

  @Column({ name: 'selling_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  sellingPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'available_qty', default: 0 })
  availableQty: number;

  @Column({ name: 'vendor_id', type: 'char', length: 36, nullable: true })
  vendorId: string;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
