import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Vehicle } from './entities/vehicle.entity';
import { JobCardEntity } from './entities/job-card.entity';
import { VehicleBrandEntity } from './entities/vehicle-brand.entity';
import { VehicleModelEntity } from './entities/vehicle-model.entity';
import { SparePartEntity } from './entities/spare-part.entity';
import { ServiceEntity } from './entities/service.entity';
import { JobSpareItemEntity } from './entities/job-spare-item.entity';
import { JobServiceItemEntity } from './entities/job-service-item.entity';
import { EmployeeEntity } from './entities/employee.entity';
import { InventoryBatchEntity } from './entities/inventory-batch.entity';
import { CustomerSourceEntity } from './entities/customer-source.entity';
import { GarageEntity } from './entities/garage.entity';
import { JobComplaintEntity } from './entities/job-complaint.entity';
import { PackageEntity } from './entities/package.entity';
import { PackageItemEntity } from './entities/package-item.entity';
import { OfferEntity } from './entities/offer.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { InventoryTransactionEntity } from './entities/inventory-transaction.entity';

export interface Complaint { text: string; finding: string; action: string; }
export interface SpareItem { id?: string; name: string; qty: number; price: number; mrp: number; hsn: string; code: string; status: string; billedTo: 'customer' | 'insurance'; }
export interface ServiceItem { id?: string; name: string; rate: number; hsn: string; code: string; status: string; billedTo: 'customer' | 'insurance'; }
export interface TimelineEntry { time: string; title: string; desc: string; }

export interface JobCard {
  id: string; vehicleNo: string; brandModel: string; customerName: string; phone: string;
  kms: number; completion: number; status: string; advisor: string; technician: string;
  urgency: string; estimate: number; paid: number; due: number; serviceType: string;
  date: string; complaints: Complaint[]; spares: SpareItem[]; services: ServiceItem[];
  timeline: TimelineEntry[]; isEstimated?: boolean; isStatusFilled?: boolean; overallDiscount?: number; rating?: number;
  paymentBreakdown?: { card: number; cash: number; cheque: number; other: number; remarks: string } | null;
  statusNote?: string;
  // Branch-aware fields
  garageId?: string;
  customerId?: string;
  finalAmount?: number;
  estimatedCost?: number;
  paidAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleBrand { id: string; name: string; }
export interface VehicleModel { id: string; brandId: string; name: string; category: string; variant: string; }
export interface Employee { id: string; name: string; role: string; }
export interface SparePartMaster { id: string; name: string; partNumber: string; price: number; mrp: number; stockQty: number; hsnCode: string; brand?: string; model?: string; variant?: string; location?: string; }
export interface InventoryStockDto {
  id: string;
  spareName: string;
  brand: string;
  model: string;
  variant: string;
  partBrand: string;
  partNo: string;
  totalQty: number;
  consumedQty: number;
  availableQty: number;
  estimatedQty: number;
  location: string;
}
export interface ServiceMaster { id: string; name: string; code: string; rate: number; sacCode: string; category?: string; }
export interface ComplaintDto { text: string; finding: string; action: string; }
export interface PackageItemDto { type: 'spare' | 'service'; id: string; name: string; code: string; qty: number; price: number; mrp: number; hsn: string; }
export interface PackageDto { id: string; name: string; description: string; totalPrice: number; spares: PackageItemDto[]; services: PackageItemDto[]; }
export interface OfferDto { id: string; title: string; description: string; offerType: string; discountValue: number; endDate: string; }
export interface InvoiceDto { invoiceNo: string; jobCardNo: string; customerName: string; vehicleNo: string; brandModel: string; subtotal: number; discountAmount: number; taxAmount: number; totalAmount: number; customerAmount: number; insuranceAmount: number; }
export interface InvoiceReportDto {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  gstin: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  customerAmount: number;
  paidAmount: number;
  dueAmount: number;
  type: string;
  vehicleNo: string;
  brandModel: string;
  phone: string;
  arrivalDate: string;
  jobCardNo: string;
}

export interface VehicleHistoryRow {
  invoiceNo: string;
  arrivalDate: string;
  kmsDriven: number;
  taxOnServices: number;
  taxOnParts: number;
  spares: number;
  labours: number;
  discount: number;
  totalAmount: number;
  totalPaid: number;
  dueAmount: number;
  techName: string;
  techFeedback: string;
  customerFeedback: string;
  jobCardNo: string;
}

const STATUS_TO_UI: Record<string, string> = {
  under_servicing: 'Under Servicing',
  next_day_delivery: 'Next Day Delivery',
  upcoming_delivery: 'Upcoming Delivery',
  ready_for_delivery: 'Ready for Delivery',
  payment_processing: 'Payment Processing',
  completed: 'Completed',
  draft: 'Draft',
  client_agreed: 'Client Agreed',
  work_in_progress: 'Work in Progress',
  work_on_hold: 'Work on Hold',
  work_completed: 'Work Completed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

const STATUS_TO_DB: Record<string, string> = {
  'Under Servicing': 'under_servicing',
  'Next Day Delivery': 'next_day_delivery',
  'Upcoming Delivery': 'upcoming_delivery',
  'Ready for Delivery': 'ready_for_delivery',
  'Payment Processing': 'payment_processing',
  'Completed': 'completed',
  'Delivered': 'delivered',
  'Draft': 'draft',
  'Client Agreed': 'client_agreed',
  'Work in Progress': 'work_in_progress',
  'Work on Hold': 'work_on_hold',
  'Work Completed': 'work_completed',
  'Out for Delivery': 'out_for_delivery',
};

const STATUS_COMPLETION: Record<string, number> = {
  client_agreed: 30,
  work_in_progress: 50,
  work_on_hold: 45,
  work_completed: 80,
  out_for_delivery: 90,
  delivered: 100,
  ready_for_delivery: 85,
  payment_processing: 70,
  completed: 100,
};

const EMPLOYEE_TYPE_TO_ROLE: Record<string, string> = {
  service_advisor: 'advisor',
  supervisor: 'advisor',
  technician: 'technician',
};

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(JobCardEntity) private jobCardRepo: Repository<JobCardEntity>,
    @InjectRepository(VehicleBrandEntity) private brandRepo: Repository<VehicleBrandEntity>,
    @InjectRepository(VehicleModelEntity) private modelRepo: Repository<VehicleModelEntity>,
    @InjectRepository(SparePartEntity) private sparesRepo: Repository<SparePartEntity>,
    @InjectRepository(ServiceEntity) private servicesRepo: Repository<ServiceEntity>,
    @InjectRepository(JobSpareItemEntity) private jobSparesRepo: Repository<JobSpareItemEntity>,
    @InjectRepository(JobServiceItemEntity) private jobServicesRepo: Repository<JobServiceItemEntity>,
    @InjectRepository(EmployeeEntity) private employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(InventoryBatchEntity) private batchRepo: Repository<InventoryBatchEntity>,
    @InjectRepository(CustomerSourceEntity) private sourceRepo: Repository<CustomerSourceEntity>,
    @InjectRepository(GarageEntity) private garageRepo: Repository<GarageEntity>,
    @InjectRepository(JobComplaintEntity) private complaintRepo: Repository<JobComplaintEntity>,
    @InjectRepository(PackageEntity) private packageRepo: Repository<PackageEntity>,
    @InjectRepository(PackageItemEntity) private packageItemRepo: Repository<PackageItemEntity>,
    @InjectRepository(OfferEntity) private offerRepo: Repository<OfferEntity>,
    @InjectRepository(InvoiceEntity) private invoiceRepo: Repository<InvoiceEntity>,
    @InjectRepository(InventoryTransactionEntity) private txnRepo: Repository<InventoryTransactionEntity>,
  ) {}

  getHello(): string { return 'BikeMasters API v1 - Database Enabled'; }

  // ── Complaints ────────────────────────────────────────────────────────────
  async getComplaints(jobCardNo: string): Promise<ComplaintDto[]> {
    const jc = await this.jobCardRepo.findOneBy({ jobCardNo });
    if (!jc) return [];
    const rows = await this.complaintRepo.findBy({ jobCardId: jc.id });
    return rows.map(r => ({ text: r.complaintText, finding: r.workshopFinding || '', action: this.dbActionToFrontend(r.action) }));
  }

  async saveComplaints(jobCardNo: string, complaints: ComplaintDto[]): Promise<void> {
    const jc = await this.jobCardRepo.findOneBy({ jobCardNo });
    if (!jc) return;
    await this.complaintRepo.delete({ jobCardId: jc.id });
    if (!complaints.length) return;
    const entities = complaints.map(c => this.complaintRepo.create({
      jobCardId: jc.id,
      complaintText: c.text,
      workshopFinding: c.finding || undefined,
      action: this.frontendActionToDb(c.action) as any,
      isRejected: c.action === 'declined',
    }));
    await this.complaintRepo.save(entities);
  }

  private frontendActionToDb(action: string): string {
    const map: Record<string, string> = { repair_now: 'repair_now', replace_now: 'repair_now', observe: 'monitor', declined: 'rejected' };
    return map[action] || 'repair_now';
  }

  private dbActionToFrontend(action: string): string {
    const map: Record<string, string> = { repair_now: 'repair_now', repair_later: 'repair_now', inform_customer: 'observe', monitor: 'observe', rejected: 'declined' };
    return map[action] || 'repair_now';
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  async getPackages(garageId?: string): Promise<PackageDto[]> {
    const where: any = { isActive: true };
    if (garageId) where.garageId = garageId;
    const pkgs = await this.packageRepo.find({ where });
    if (!pkgs.length) return [];

    const pkgIds = pkgs.map(p => p.id);
    const items = await this.packageItemRepo.findBy({ packageId: In(pkgIds) });

    const spareIds = items.filter(i => i.sparePartId).map(i => i.sparePartId);
    const serviceIds = items.filter(i => i.serviceId).map(i => i.serviceId);

    const [spareParts, services, batches] = await Promise.all([
      spareIds.length ? this.sparesRepo.findBy({ id: In(spareIds) }) : [],
      serviceIds.length ? this.servicesRepo.findBy({ id: In(serviceIds) }) : [],
      spareIds.length ? this.batchRepo.createQueryBuilder('b').where('b.sparePartId IN (:...ids)', { ids: spareIds }).orderBy('b.createdAt', 'DESC').getMany() : [],
    ]);

    const spareMap = new Map((spareParts as SparePartEntity[]).map(s => [s.id, s]));
    const serviceMap = new Map((services as ServiceEntity[]).map(s => [s.id, s]));
    const latestBatch = new Map<string, InventoryBatchEntity>();
    for (const b of batches as InventoryBatchEntity[]) {
      if (!latestBatch.has(b.sparePartId)) latestBatch.set(b.sparePartId, b);
    }

    return pkgs.map(pkg => {
      const pkgItems = items.filter(i => i.packageId === pkg.id);
      const spares: PackageItemDto[] = pkgItems.filter(i => i.itemType === 'spare' && i.sparePartId).map(i => {
        const sp = spareMap.get(i.sparePartId);
        const b = latestBatch.get(i.sparePartId);
        return { type: 'spare', id: i.sparePartId, name: sp?.partName || 'Part', code: sp?.partNumber || '', qty: Number(i.quantity), price: b ? Number(b.sellingPrice) : Number(i.rate), mrp: b ? Number(b.mrp) : Number(i.rate), hsn: sp?.hsnCode || 'N/A' };
      });
      const services2: PackageItemDto[] = pkgItems.filter(i => i.itemType === 'service' && i.serviceId).map(i => {
        const sv = serviceMap.get(i.serviceId);
        return { type: 'service', id: i.serviceId, name: sv?.serviceName || 'Service', code: sv?.serviceCode || '', qty: 1, price: Number(i.rate), mrp: Number(i.rate), hsn: sv?.hsnSacCode || 'N/A' };
      });
      return { id: pkg.id, name: pkg.packageName, description: pkg.description || '', totalPrice: Number(pkg.totalPrice), spares, services: services2 };
    });
  }

  // ── Offers ────────────────────────────────────────────────────────────────
  async getOffers(garageId?: string): Promise<OfferDto[]> {
    const today = new Date().toISOString().split('T')[0];
    const qb = this.offerRepo
      .createQueryBuilder('o')
      .where('o.isActive = true AND o.endDate >= :today', { today });
    if (garageId) qb.andWhere('o.garageId = :garageId', { garageId });
    const rows = await qb.getMany();
    return rows.map(o => ({ id: o.id, title: o.title, description: o.description || '', offerType: o.offerType, discountValue: Number(o.discountValue), endDate: o.endDate?.toString() || '' }));
  }

  // ── Add Spare Part to Master ───────────────────────────────────────────────
  async addSparePartToMaster(data: any, garageId?: string): Promise<SparePartMaster> {
    if (!garageId) {
      const garage = await this.garageRepo.findOne({ where: { isActive: true } });
      garageId = garage?.id || '';
    }
    const part = await this.sparesRepo.save(this.sparesRepo.create({ garageId, partName: data.name, partNumber: data.partNo, hsnCode: data.hsn || 'N/A' }));
    const batch = await this.batchRepo.save(this.batchRepo.create({
      sparePartId: part.id, garageId, batchNo: `BATCH-${Date.now()}`,
      purchasePrice: Number(data.price) * 0.8, mrp: Number(data.mrp), sellingPrice: Number(data.price),
      quantity: Number(data.stock) || 50, availableQty: Number(data.stock) || 50, purchaseDate: new Date(),
    }));
    return { id: part.id, name: part.partName, partNumber: part.partNumber, price: Number(batch.sellingPrice), mrp: Number(batch.mrp), stockQty: batch.availableQty, hsnCode: part.hsnCode || 'N/A' };
  }

  // ── Add Service to Master ─────────────────────────────────────────────────
  async addServiceToMaster(data: any, garageId?: string): Promise<ServiceMaster> {
    if (!garageId) {
      const garage = await this.garageRepo.findOne({ where: { isActive: true } });
      garageId = garage?.id || '';
    }
    const sv = await this.servicesRepo.save(this.servicesRepo.create({ 
      garageId, 
      serviceName: data.name, 
      serviceCode: data.code, 
      category: data.category,
      defaultRate: Number(data.rate || data.amount), 
      hsnSacCode: data.sac || data.sacCode || '998714' 
    }));
    return { id: sv.id, name: sv.serviceName, code: sv.serviceCode, rate: Number(sv.defaultRate), sacCode: sv.hsnSacCode || 'N/A', category: sv.category };
  }

  async updateServiceInMaster(id: string, data: any): Promise<ServiceMaster> {
    await this.servicesRepo.update(id, {
      serviceName: data.name,
      serviceCode: data.code,
      category: data.category,
      defaultRate: Number(data.rate || data.amount),
      hsnSacCode: data.sac || data.sacCode,
    });
    const sv = await this.servicesRepo.findOneBy({ id });
    if (!sv) throw new Error(`Service ${id} not found`);
    return { id: sv.id, name: sv.serviceName, code: sv.serviceCode, rate: Number(sv.defaultRate), sacCode: sv.hsnSacCode || 'N/A', category: sv.category };
  }

  async deleteServiceFromMaster(id: string): Promise<void> {
    await this.servicesRepo.update(id, { isActive: false });
  }

  // ── Generate Invoice ──────────────────────────────────────────────────────
  async generateInvoice(jobCardNo: string, data: any, garageId?: string): Promise<InvoiceDto> {
    const jc = await this.jobCardRepo.findOneBy({ jobCardNo });
    if (!jc) throw new NotFoundException(`Job card ${jobCardNo} not found`);

    const [customer, vehicle] = await Promise.all([
      this.customerRepo.findOneBy({ id: jc.customerId }),
      this.vehicleRepo.findOneBy({ id: jc.vehicleId }),
    ]);

    let brandModel = 'Bike';
    if (vehicle) {
      const model = await this.modelRepo.findOneBy({ id: vehicle.modelId });
      if (model) {
        const brand = await this.brandRepo.findOneBy({ id: model.brandId });
        brandModel = `${brand?.name || ''} ${model.name}`.trim();
      }
    }

    const resolvedGarageId = garageId || jc.garageId;
    const count = await this.invoiceRepo.countBy({ garageId: resolvedGarageId });
    const garage = resolvedGarageId ? await this.garageRepo.findOneBy({ id: resolvedGarageId }) : await this.garageRepo.findOne({ where: { isActive: true } });
    const garageCode = garage?.code?.split('-')[0] || 'WMS';
    const year = new Date().getFullYear();
    const invoiceNo = `INV-${garageCode}-${year}-${String(count + 1).padStart(5, '0')}`;

    const subtotal = Number(data.subtotal) || 0;
    const discountAmount = Number(data.discountAmount) || 0;
    const taxAmount = Number(data.taxAmount) || 0;
    const totalAmount = Number(data.totalAmount) || 0;
    const customerAmount = Number(data.customerAmount) || totalAmount;
    const insuranceAmount = Number(data.insuranceAmount) || 0;

    const existing = await this.invoiceRepo.findOneBy({ jobCardId: jc.id });
    const invoiceData = { invoiceNo: existing?.invoiceNo || invoiceNo, jobCardId: jc.id, garageId: jc.garageId, customerId: jc.customerId, invoiceType: 'estimate' as const, subtotal, discountAmount, taxAmount, totalAmount, customerAmount, insuranceAmount, status: 'draft' as const };

    if (existing) {
      await this.invoiceRepo.update(existing.id, { subtotal, discountAmount, taxAmount, totalAmount, customerAmount, insuranceAmount });
    } else {
      await this.invoiceRepo.save(this.invoiceRepo.create(invoiceData));
    }

    await this.jobCardRepo.update({ jobCardNo }, { isEstimated: true, overallDiscount: discountAmount });

    return { invoiceNo: invoiceData.invoiceNo, jobCardNo, customerName: customer?.name || 'Customer', vehicleNo: vehicle?.registrationNo || 'N/A', brandModel, subtotal, discountAmount, taxAmount, totalAmount, customerAmount, insuranceAmount };
  }

  async getInvoices(garageId?: string): Promise<InvoiceReportDto[]> {
    const where: any = {};
    if (garageId) where.garageId = garageId;
    const invoices = await this.invoiceRepo.find({ where, order: { createdAt: 'DESC' } });

    const reportData: InvoiceReportDto[] = [];

    for (const inv of invoices) {
      const jc = await this.jobCardRepo.findOneBy({ id: inv.jobCardId });
      const customer = await this.customerRepo.findOneBy({ id: inv.customerId });
      
      let vehicleNo = 'N/A';
      let brandModel = 'N/A';
      let arrivalDate = 'N/A';
      let phone = 'N/A';

      if (jc) {
        const vehicle = await this.vehicleRepo.findOneBy({ id: jc.vehicleId });
        if (vehicle) {
          vehicleNo = vehicle.registrationNo;
          const model = await this.modelRepo.findOneBy({ id: vehicle.modelId });
          if (model) {
            const brand = await this.brandRepo.findOneBy({ id: model.brandId });
            brandModel = `${brand?.name || ''} ${model.name}`.trim();
          }
        }
        arrivalDate = jc.dateOfArrival?.toISOString().split('T')[0] || 'N/A';
        phone = customer?.phone || 'N/A';
      }

      reportData.push({
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        date: inv.createdAt.toISOString().split('T')[0],
        customerName: customer?.name || 'Unknown',
        gstin: customer?.gstin || '—',
        subtotal: Number(inv.subtotal),
        taxAmount: Number(inv.taxAmount),
        totalAmount: Number(inv.totalAmount),
        discountAmount: Number(inv.discountAmount),
        insuranceAmount: Number(inv.insuranceAmount),
        customerAmount: Number(inv.customerAmount),
        paidAmount: jc ? Number(jc.paidAmount) : 0,
        dueAmount: jc ? Math.max(0, Number(inv.totalAmount) - Number(jc.paidAmount)) : Number(inv.totalAmount),
        type: inv.invoiceType === 'counter_sale' ? 'Counter Sales' : 'Services',
        vehicleNo,
        brandModel,
        phone,
        arrivalDate,
        jobCardNo: jc?.jobCardNo || 'N/A',
      });
    }

    return reportData;
  }

  // ── Brands ────────────────────────────────────────────────────────────────
  async getBrands(): Promise<VehicleBrand[]> {
    const rows = await this.brandRepo.find({ where: { isActive: true } });
    return rows.map(r => ({ id: r.id, name: r.name }));
  }

  // ── Models ────────────────────────────────────────────────────────────────
  async getModels(brandId?: string): Promise<VehicleModel[]> {
    const where: any = { isActive: true };
    if (brandId) where.brandId = brandId;
    const rows = await this.modelRepo.find({ where });
    return rows.map(r => ({ id: r.id, brandId: r.brandId, name: r.name, category: r.vehicleType, variant: '' }));
  }

  // ── Employees ─────────────────────────────────────────────────────────────
  async getEmployees(role?: string, garageId?: string): Promise<Employee[]> {
    const where: any = { isActive: true };
    if (garageId) where.garageId = garageId;
    const rows = await this.employeeRepo.find({ where });
    const mapped = rows.map(r => ({
      id: r.id,
      name: r.name,
      role: EMPLOYEE_TYPE_TO_ROLE[r.type] || r.type,
      phone: r.phone,
      email: r.email,
      employeeCode: r.employeeCode,
      garageId: r.garageId,
      username: r.employeeCode,
      contact: r.phone,
    }));
    return role ? mapped.filter(e => e.role === role) : mapped;
  }

  // ── Spare Parts ───────────────────────────────────────────────────────────
  async getSpareParts(query?: string, garageId?: string): Promise<SparePartMaster[]> {
    if (!garageId) return [];
    const qb = this.sparesRepo.createQueryBuilder('sp')
      .where('sp.isActive = true')
      .andWhere('sp.garageId = :garageId', { garageId });
    if (query) qb.andWhere('(sp.partName LIKE :q OR sp.partNumber LIKE :q)', { q: `%${query}%` });
    const parts = await qb.getMany();
    if (!parts.length) return [];

    // Batch fetch latest batch per spare part for price/mrp/stock
    const partIds = parts.map(p => p.id);
    const batches = await this.batchRepo
      .createQueryBuilder('b')
      .where('b.sparePartId IN (:...ids)', { ids: partIds })
      .orderBy('b.createdAt', 'DESC')
      .getMany();

    // Keep only the latest batch per spare part
    const latestBatch = new Map<string, InventoryBatchEntity>();
    for (const b of batches) {
      if (!latestBatch.has(b.sparePartId)) latestBatch.set(b.sparePartId, b);
    }

    return parts.map(p => {
      const batch = latestBatch.get(p.id);
      return {
        id: p.id,
        name: p.partName,
        partNumber: p.partNumber,
        price: batch ? Number(batch.sellingPrice) : 0,
        mrp: batch ? Number(batch.mrp) : 0,
        stockQty: batch ? batch.availableQty : 0,
        hsnCode: p.hsnCode || 'N/A',
      };
    });
  }

  async getInventoryStockSummary(garageId?: string): Promise<InventoryStockDto[]> {
    if (!garageId) return [];
    const parts = await this.sparesRepo.find({ where: { isActive: true, garageId } });
    if (!parts.length) return [];

    const partIds = parts.map(p => p.id);

    // Fetch batches and transactions in parallel
    const [batches, issueTxns, estimatedItems] = await Promise.all([
      this.batchRepo.createQueryBuilder('b').where('b.sparePartId IN (:...ids)', { ids: partIds }).getMany(),
      this.txnRepo.createQueryBuilder('t')
        .select('t.sparePartId', 'sparePartId')
        .addSelect('SUM(t.quantity)', 'issued')
        .where('t.sparePartId IN (:...ids)', { ids: partIds })
        .andWhere("t.transactionType = 'issue'")
        .groupBy('t.sparePartId')
        .getRawMany(),
      this.jobSparesRepo.createQueryBuilder('js')
        .select('js.partNumber', 'partNumber')
        .addSelect('SUM(js.quantity)', 'estimatedQty')
        .where("js.status = 'estimated'")
        .groupBy('js.partNumber')
        .getRawMany(),
    ]);

    // Build lookup maps
    const issueMap = new Map<string, number>(issueTxns.map(r => [r.sparePartId, Number(r.issued)]));
    const estimatedMap = new Map<string, number>(estimatedItems.map(r => [r.partNumber, Number(r.estimatedQty)]));

    return parts.map(p => {
      const partBatches = batches.filter(b => b.sparePartId === p.id);
      const totalQty = partBatches.reduce((acc, b) => acc + Number(b.quantity), 0);
      const availableQty = partBatches.reduce((acc, b) => acc + Number(b.availableQty), 0);

      // Use transaction ledger if records exist, else fall back to batch difference
      const txnConsumed = issueMap.get(p.id);
      const consumedQty = txnConsumed !== undefined ? txnConsumed : (totalQty - availableQty);

      return {
        id: p.id,
        spareName: p.partName,
        brand: p.compatibleBrand || 'Universal',
        model: p.compatibleModel || 'All Models',
        variant: p.compatibleVariant || 'N/A',
        partBrand: p.partBrand || 'OEM',
        partNo: p.partNumber,
        totalQty,
        consumedQty,
        availableQty,
        estimatedQty: estimatedMap.get(p.partNumber) || 0,
        location: p.binLocation || 'Storage',
      };
    });
  }

  // ── Services Master ───────────────────────────────────────────────────────
  async getServicesMaster(query?: string, garageId?: string): Promise<ServiceMaster[]> {
    if (!garageId) return [];
    const qb = this.servicesRepo.createQueryBuilder('sv')
      .where('sv.isActive = true')
      .andWhere('sv.garageId = :garageId', { garageId });
    if (query) qb.andWhere('(sv.serviceName LIKE :q OR sv.serviceCode LIKE :q)', { q: `%${query}%` });
    const rows = await qb.getMany();
    return rows.map(r => ({ 
      id: r.id, 
      name: r.serviceName, 
      code: r.serviceCode, 
      rate: Number(r.defaultRate), 
      sacCode: r.hsnSacCode || 'N/A',
      category: r.category || 'Mechanical Services'
    }));
  }

  // ── Customer Sources ──────────────────────────────────────────────────────
  async getCustomerSources(garageId?: string): Promise<string[]> {
    const where: any = { isActive: true };
    if (garageId) where.garageId = garageId;
    const rows = await this.sourceRepo.find({ where });
    return rows.map(r => r.name);
  }

  // ── Save Spare Items ──────────────────────────────────────────────────────
  async saveSpareItems(jobCardId: string, items: any[], garageId?: string) {
    if (!garageId) {
      const garage = await this.garageRepo.findOne({ where: { isActive: true } });
      garageId = garage?.id || '';
    }

    // Restore batch qty for any existing issue transactions on this job card
    const existingTxns = await this.txnRepo.find({
      where: { referenceType: 'job_card', referenceId: jobCardId, transactionType: 'issue' },
    });
    for (const txn of existingTxns) {
      if (txn.batchId) {
        await this.batchRepo.increment({ id: txn.batchId }, 'availableQty', txn.quantity);
      }
    }
    if (existingTxns.length) await this.txnRepo.remove(existingTxns);

    // Save job spare items
    await this.jobSparesRepo.delete({ jobCardId });
    const entities = items.map(item => this.jobSparesRepo.create({
      jobCardId, partName: item.name, partNumber: item.code,
      sparePartId: item.sparePartId || null,
      price: item.price, mrp: item.mrp || item.price,
      quantity: item.qty, billedTo: item.billedTo || 'customer', status: item.status || 'estimated',
    }));
    const saved = await this.jobSparesRepo.save(entities);

    // Create issue transactions and deduct from batches (best-effort — don't fail the save)
    let systemUserId: string | null = null;
    try {
      const [row] = await this.garageRepo.query('SELECT id FROM users LIMIT 1') as { id: string }[];
      systemUserId = row?.id || null;
    } catch { /* users table not accessible */ }

    for (const item of items) {
      const qty = Number(item.qty) || 1;
      let sparePartId: string | null = item.sparePartId || null;
      if (!sparePartId && item.code) {
        const part = await this.sparesRepo.findOne({ where: { partNumber: item.code, isActive: true } });
        sparePartId = part?.id || null;
      }
      if (!sparePartId) continue;

      try {
        const batch = await this.batchRepo
          .createQueryBuilder('b')
          .where('b.sparePartId = :id AND b.availableQty > 0', { id: sparePartId })
          .orderBy('b.availableQty', 'DESC')
          .getOne();
        if (!batch) continue;

        const deduct = Math.min(qty, batch.availableQty);
        await this.batchRepo.decrement({ id: batch.id }, 'availableQty', deduct);
        if (systemUserId) {
          await this.txnRepo.save(this.txnRepo.create({
            sparePartId,
            garageId,
            batchId: batch.id,
            transactionType: 'issue',
            referenceType: 'job_card',
            referenceId: jobCardId,
            quantity: deduct,
            unitPrice: Number(item.price),
            createdBy: systemUserId,
          }));
        }
      } catch {
        // inventory deduction is best-effort; don't fail the whole save
      }
    }

    return saved;
  }

  // ── Save Service Items ────────────────────────────────────────────────────
  async saveServiceItems(jobCardId: string, items: any[]) {
    await this.jobServicesRepo.delete({ jobCardId });
    const entities = items.map(item => this.jobServicesRepo.create({
      jobCardId, serviceName: item.name, serviceCode: item.code,
      rate: item.rate, billedTo: item.billedTo || 'customer', status: item.status || 'estimated',
    }));
    return this.jobServicesRepo.save(entities);
  }

  // ── Job Cards List (batch-fetches all related data — no N+1) ─────────────
  async getJobCards(status?: string, search?: string, garageId?: string): Promise<JobCard[]> {
    if (!garageId) return [];
    const qb = this.jobCardRepo.createQueryBuilder('jc')
      .where('jc.isDeleted = :deleted', { deleted: false })
      .andWhere('jc.status != :del', { del: 'deleted' })
      .andWhere('jc.garageId = :garageId', { garageId });

    if (status && status !== 'All Jobs') {
      const dbStatus = STATUS_TO_DB[status] || status.toLowerCase().replace(/ /g, '_');
      qb.andWhere('jc.status = :status', { status: dbStatus });
    }
    if (search) qb.andWhere('jc.jobCardNo LIKE :search', { search: `%${search}%` });

    const cards = await qb.getMany();
    if (!cards.length) return [];

    // Batch-fetch everything in 6 parallel queries instead of N×6
    const vehicleIds = [...new Set(cards.map(c => c.vehicleId).filter(Boolean))];
    const customerIds = [...new Set(cards.map(c => c.customerId).filter(Boolean))];
    const advisorIds = [...new Set(cards.map(c => c.serviceAdvisorId).filter(Boolean))];
    const jobCardNos = cards.map(c => c.jobCardNo);

    const [vehicles, customers, allSpares, allServices, advisors] = await Promise.all([
      vehicleIds.length ? this.vehicleRepo.findBy({ id: In(vehicleIds) }) : [],
      customerIds.length ? this.customerRepo.findBy({ id: In(customerIds) }) : [],
      this.jobSparesRepo.findBy({ jobCardId: In(jobCardNos) }),
      this.jobServicesRepo.findBy({ jobCardId: In(jobCardNos) }),
      advisorIds.length ? this.employeeRepo.findBy({ id: In(advisorIds) }) : [],
    ]);

    const modelIds = [...new Set((vehicles as Vehicle[]).map(v => v.modelId).filter(Boolean))];
    const [models] = await Promise.all([
      modelIds.length ? this.modelRepo.findBy({ id: In(modelIds) }) : [],
    ]);
    const brandIds = [...new Set((models as VehicleModelEntity[]).map(m => m.brandId).filter(Boolean))];
    const brands = brandIds.length ? await this.brandRepo.findBy({ id: In(brandIds) }) : [];

    // Build lookup maps
    const vehicleMap = new Map((vehicles as Vehicle[]).map(v => [v.id, v]));
    const customerMap = new Map((customers as Customer[]).map(c => [c.id, c]));
    const modelMap = new Map((models as VehicleModelEntity[]).map(m => [m.id, m]));
    const brandMap = new Map((brands as VehicleBrandEntity[]).map(b => [b.id, b]));
    const advisorMap = new Map((advisors as EmployeeEntity[]).map(a => [a.id, a.name]));
    const sparesMap = new Map<string, JobSpareItemEntity[]>();
    const servicesMap = new Map<string, JobServiceItemEntity[]>();
    for (const s of allSpares as JobSpareItemEntity[]) {
      if (!sparesMap.has(s.jobCardId)) sparesMap.set(s.jobCardId, []);
      sparesMap.get(s.jobCardId)!.push(s);
    }
    for (const s of allServices as JobServiceItemEntity[]) {
      if (!servicesMap.has(s.jobCardId)) servicesMap.set(s.jobCardId, []);
      servicesMap.get(s.jobCardId)!.push(s);
    }

    return cards.map(e => {
      const vehicle = vehicleMap.get(e.vehicleId);
      const customer = customerMap.get(e.customerId);
      const model = vehicle ? modelMap.get(vehicle.modelId) : null;
      const brand = model ? brandMap.get(model.brandId) : null;
      const brandModel = brand && model ? `${brand.name} ${model.name}`.trim() : 'Bike';
      const dbSpares = sparesMap.get(e.jobCardNo) || [];
      const dbServices = servicesMap.get(e.jobCardNo) || [];
      const advisorName = e.serviceAdvisorId ? (advisorMap.get(e.serviceAdvisorId) || 'Assigned') : 'Assigned';
      return this.buildJobCardDto(e, vehicle ?? null, customer ?? null, brandModel, dbSpares, dbServices, [], advisorName);
    });
  }

  // ── Single Job Card ───────────────────────────────────────────────────────
  async getJobCardById(id: string): Promise<JobCard> {
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo: id });
    if (!entity) throw new NotFoundException(`Job card ${id} not found`);

    const [vehicle, customer, dbSpares, dbServices, dbComplaints, advisorEmployee] = await Promise.all([
      this.vehicleRepo.findOneBy({ id: entity.vehicleId }),
      this.customerRepo.findOneBy({ id: entity.customerId }),
      this.jobSparesRepo.findBy({ jobCardId: entity.jobCardNo }),
      this.jobServicesRepo.findBy({ jobCardId: entity.jobCardNo }),
      this.complaintRepo.findBy({ jobCardId: entity.id }),
      entity.serviceAdvisorId ? this.employeeRepo.findOneBy({ id: entity.serviceAdvisorId }) : Promise.resolve(null),
    ]);

    let brandModel = 'Bike';
    if (vehicle) {
      const model = await this.modelRepo.findOneBy({ id: vehicle.modelId });
      if (model) {
        const brand = await this.brandRepo.findOneBy({ id: model.brandId });
        brandModel = `${brand?.name || ''} ${model.name}`.trim();
      }
    }
    const advisorName = (advisorEmployee as EmployeeEntity | null)?.name || 'Assigned';
    return this.buildJobCardDto(entity, vehicle, customer, brandModel, dbSpares, dbServices, dbComplaints, advisorName);
  }

  // ── Create Job Card ───────────────────────────────────────────────────────
  async createJobCard(data: any, garageId?: string): Promise<JobCard> {
    // Resolve garage — prefer the passed garageId, fall back to first active
    const garage = garageId
      ? await this.garageRepo.findOneBy({ id: garageId })
      : await this.garageRepo.findOne({ where: { isActive: true } });
    const resolvedGarageId = garage?.id || garageId || '';
    const organizationId = garage?.organizationId || '';

    // 1. Ensure Customer exists
    let customer = await this.customerRepo.findOneBy({ phone: data.phone });
    if (!customer) {
      customer = await this.customerRepo.save(this.customerRepo.create({
        garageId: resolvedGarageId, name: data.customerName || 'New Customer', phone: data.phone || '0000000000', customerType: 'individual',
      }));
    }

    // 2. Resolve Brand and Model
    const [brandName, ...modelParts] = (data.brandModel || 'Other Other').split(' ');
    const modelName = modelParts.join(' ') || 'General';

    let brand = await this.brandRepo.findOneBy({ name: brandName });
    if (!brand) brand = await this.brandRepo.save(this.brandRepo.create({ name: brandName, organizationId }));

    let model = await this.modelRepo.findOneBy({ name: modelName, brandId: brand.id });
    if (!model) model = await this.modelRepo.save(this.modelRepo.create({ name: modelName, brandId: brand.id, fuelType: 'petrol', vehicleType: 'two_wheeler' }));

    // 3. Ensure Vehicle exists
    let vehicle = await this.vehicleRepo.findOneBy({ registrationNo: (data.vehicleNo || 'TEMP').toUpperCase() });
    if (!vehicle) {
      vehicle = await this.vehicleRepo.save(this.vehicleRepo.create({
        registrationNo: (data.vehicleNo || 'TEMP').toUpperCase(), organizationId, modelId: model.id, numberPlateColor: 'white',
      }));
    }

    // 4. Generate job card number — branch-scoped sequence to avoid cross-branch collisions
    const count = await this.jobCardRepo.countBy({ garageId: resolvedGarageId });
    const garageCode = garage?.code?.split('-')[0] || 'WMS';
    const year = new Date().getFullYear();
    const jobCardNo = `JC-${garageCode}-${year}-${String(count + 1).padStart(5, '0')}`;

    const serviceTypeMap: Record<string, string> = {
      Regular: 'regular', Express: 'express', Accidental: 'accidental',
      'Insurance Claim': 'insurance_claim', 'Free Service': 'free_service',
    };

    const saved = await this.jobCardRepo.save(this.jobCardRepo.create({
      jobCardNo, garageId: resolvedGarageId, vehicleId: vehicle.id, customerId: customer.id,
      odometerIn: data.kms || 0, status: 'under_servicing',
      serviceType: serviceTypeMap[data.serviceType] || 'regular',
      customerComplaints: JSON.stringify(data.complaints || []),
      completion: 10, isEstimated: false, isStatusFilled: false, overallDiscount: 0,
    }));

    return this.getJobCardById(saved.jobCardNo);
  }

  // ── Update Job Card ───────────────────────────────────────────────────────
  async updateJobCard(id: string, data: Partial<JobCard>): Promise<JobCard> {
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo: id });
    if (!entity) throw new NotFoundException(`Job card ${id} not found`);

    if (data.customerName || data.phone) {
      const customer = await this.customerRepo.findOneBy({ id: entity.customerId });
      if (customer) {
        if (data.customerName) customer.name = data.customerName;
        if (data.phone) customer.phone = data.phone;
        await this.customerRepo.save(customer);
      }
    }

    if (data.vehicleNo) {
      const vehicle = await this.vehicleRepo.findOneBy({ id: entity.vehicleId });
      if (vehicle) { vehicle.registrationNo = data.vehicleNo.toUpperCase(); await this.vehicleRepo.save(vehicle); }
    }

    if (data.kms !== undefined) entity.odometerIn = data.kms;
    if (data.isEstimated !== undefined) entity.isEstimated = data.isEstimated;
    if (data.isStatusFilled !== undefined) entity.isStatusFilled = data.isStatusFilled;
    if (data.overallDiscount !== undefined) entity.overallDiscount = data.overallDiscount;
    if (data.completion !== undefined) entity.completion = data.completion;
    if (data.status) {
      const dbStatus = STATUS_TO_DB[data.status] || data.status;
      if (dbStatus !== entity.status) {
        const note = (data as any).statusNote || '';
        const historyEntry = { time: new Date().toISOString(), status: dbStatus, label: data.status, note };
        entity.statusHistory = [...(entity.statusHistory || []), historyEntry];
        if (STATUS_COMPLETION[dbStatus] !== undefined && data.completion === undefined) {
          entity.completion = STATUS_COMPLETION[dbStatus];
        }
      }
      entity.status = dbStatus;
    }
    if ((data as any).paid !== undefined) entity.paidAmount = (data as any).paid;
    if ((data as any).paymentBreakdown !== undefined) entity.paymentBreakdown = (data as any).paymentBreakdown;
    if ((data as any).actualDeliveryDate !== undefined) entity.actualDeliveryDate = new Date((data as any).actualDeliveryDate);

    if (data.advisor) {
      const emp = await this.employeeRepo.findOneBy({ name: data.advisor, isActive: true });
      if (emp) entity.serviceAdvisorId = emp.id;
    }

    if (data.complaints) entity.customerComplaints = JSON.stringify(data.complaints);

    const saved = await this.jobCardRepo.save(entity);
    return this.getJobCardById(saved.jobCardNo);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  async getStats(garageId?: string) {
    const base: any = { isDeleted: false };
    if (garageId) base.garageId = garageId;

    const [total, underServicing, ready, payment, completed] = await Promise.all([
      this.jobCardRepo.countBy({ ...base }),
      this.jobCardRepo.countBy({ ...base, status: 'under_servicing' }),
      this.jobCardRepo.countBy({ ...base, status: 'ready_for_delivery' }),
      this.jobCardRepo.countBy({ ...base, status: 'payment_processing' }),
      this.jobCardRepo.countBy({ ...base, status: 'completed' }),
    ]);

    const revenueQb = this.jobCardRepo
      .createQueryBuilder('jc')
      .select('SUM(jc.overallDiscount)', 'discount')
      .where('jc.status = :s AND jc.isDeleted = false', { s: 'completed' });
    if (garageId) revenueQb.andWhere('jc.garageId = :garageId', { garageId });
    const revenueRow = await revenueQb.getRawOne();

    return { total, underServicing, ready, payment, completed, revenue: Number(revenueRow?.discount) || 0 };
  }

  // ── Private: Build DTO from entities ─────────────────────────────────────
  private buildJobCardDto(
    entity: JobCardEntity,
    vehicle: Vehicle | null,
    customer: Customer | null,
    brandModel: string,
    dbSpares: JobSpareItemEntity[],
    dbServices: JobServiceItemEntity[],
    dbComplaints: JobComplaintEntity[] = [],
    advisorName = 'Assigned',
  ): JobCard {
    const spareTotal = dbSpares.reduce((sum, s) => sum + Number(s.price) * s.quantity, 0);
    const serviceTotal = dbServices.reduce((sum, s) => sum + Number(s.rate), 0);
    const estimate = spareTotal + serviceTotal;
    const discount = Number(entity.overallDiscount) || 0;
    const paid = Number(entity.paidAmount) || 0;
    const due = Math.max(0, estimate - discount - paid);

    const createdAt = entity.createdAt ? new Date(entity.createdAt).toISOString() : new Date().toISOString();
    const updatedAt = entity.updatedAt ? new Date(entity.updatedAt).toISOString() : createdAt;
    const timeline: TimelineEntry[] = [
      { time: createdAt, title: 'Job Card Created', desc: `Vehicle checked in — ${vehicle?.registrationNo || 'N/A'}` },
    ];
    if (entity.isEstimated) {
      timeline.push({ time: updatedAt, title: 'Estimation Calculated', desc: `Estimate: ₹${estimate.toFixed(2)}` });
    }
    if (discount > 0) {
      timeline.push({ time: updatedAt, title: 'Discount Applied', desc: `Discount: ₹${discount.toFixed(2)}` });
    }
    if (Array.isArray(entity.statusHistory)) {
      for (const h of entity.statusHistory) {
        timeline.push({ time: h.time, title: `Status: ${h.label}`, desc: h.note || `Updated to ${h.label}` });
      }
    }

    return {
      id: entity.jobCardNo,
      vehicleNo: vehicle?.registrationNo || 'UNKNOWN',
      brandModel,
      customerName: customer?.name || 'Anonymous',
      phone: customer?.phone || 'N/A',
      kms: entity.odometerIn,
      completion: entity.completion ?? (entity.status === 'completed' ? 100 : 10),
      status: STATUS_TO_UI[entity.status] || entity.status,
      advisor: advisorName,
      technician: 'Assigned',
      urgency: 'Medium',
      estimate,
      paid,
      due,
      serviceType: entity.serviceType,
      date: entity.dateOfArrival ? new Date(entity.dateOfArrival).toDateString() : new Date().toDateString(),
      complaints: dbComplaints.map(c => ({ text: c.complaintText, finding: c.workshopFinding || '', action: this.dbActionToFrontend(c.action) })),
      spares: dbSpares.map(s => ({
        id: s.id, name: s.partName, qty: s.quantity,
        price: Number(s.price), mrp: Number(s.mrp),
        hsn: s.partNumber, code: s.partNumber,
        status: s.status, billedTo: s.billedTo as any,
      })),
      services: dbServices.map(s => ({
        id: s.id, name: s.serviceName, rate: Number(s.rate),
        hsn: s.serviceCode, code: s.serviceCode,
        status: s.status, billedTo: s.billedTo as any,
      })),
      timeline,
      isEstimated: entity.isEstimated,
      isStatusFilled: entity.isStatusFilled,
      overallDiscount: discount,
      rating: entity.rating ?? null,
      paymentBreakdown: entity.paymentBreakdown ?? null,
      garageId: entity.garageId,
      customerId: entity.customerId,
      finalAmount: estimate - discount,
      estimatedCost: estimate,
      paidAmount: paid,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }

  async updateRating(jobCardNo: string, rating: number): Promise<void> {
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo });
    if (!entity) throw new Error(`Job card ${jobCardNo} not found`);
    await this.jobCardRepo.update(entity.id, { rating });
  }

  // ── Estimation Context (single load endpoint) ─────────────────────────────
  async getEstimationContext(jobCardNo: string) {
    // First fetch the job card to get its garageId for branch-scoped lookups
    const jobCard = await this.getJobCardById(jobCardNo);
    const garageId = (jobCard as any)?.garageId;
    
    const [complaints, packages, offers, employees, spareCatalog, serviceCatalog] = await Promise.all([
      this.getComplaints(jobCardNo),
      this.getPackages(garageId),
      this.getOffers(garageId),
      this.getEmployees(undefined, garageId),
      this.getSpareParts('', garageId),
      this.getServicesMaster('', garageId),
    ]);
    return { jobCard, complaints, packages, offers, employees, spareCatalog, serviceCatalog };
  }

  // ── Vehicle History ───────────────────────────────────────────────────────
  async getVehicleHistory(vehicleNo: string): Promise<VehicleHistoryRow[]> {
    const vehicle = await this.vehicleRepo.findOne({ where: { registrationNo: vehicleNo.toUpperCase() } });
    if (!vehicle) return [];

    const jobCards = await this.jobCardRepo.find({
      where: { vehicleId: vehicle.id, isDeleted: false },
      order: { dateOfArrival: 'DESC' },
    });
    if (!jobCards.length) return [];

    const jobCardIds = jobCards.map(jc => jc.id);
    const jobCardNos = jobCards.map(jc => jc.jobCardNo);

    const [invoices, allSpares, allServices, advisors] = await Promise.all([
      this.invoiceRepo.find({ where: { jobCardId: In(jobCardIds) } }),
      this.jobSparesRepo.find({ where: { jobCardId: In(jobCardNos) } }),
      this.jobServicesRepo.find({ where: { jobCardId: In(jobCardNos) } }),
      this.employeeRepo.find(),
    ]);

    const invoiceMap = new Map(invoices.map(inv => [inv.jobCardId, inv]));
    const sparesMap = new Map<string, JobSpareItemEntity[]>();
    const servicesMap = new Map<string, JobServiceItemEntity[]>();
    for (const s of allSpares) {
      if (!sparesMap.has(s.jobCardId)) sparesMap.set(s.jobCardId, []);
      sparesMap.get(s.jobCardId)!.push(s);
    }
    for (const s of allServices) {
      if (!servicesMap.has(s.jobCardId)) servicesMap.set(s.jobCardId, []);
      servicesMap.get(s.jobCardId)!.push(s);
    }
    const advisorMap = new Map(advisors.map(e => [e.id, e]));

    return jobCards.map(jc => {
      const invoice = invoiceMap.get(jc.id);
      const spareItems = sparesMap.get(jc.jobCardNo) || [];
      const serviceItems = servicesMap.get(jc.jobCardNo) || [];

      const sparesTotal = spareItems.reduce((sum, s) => sum + Number(s.price) * s.quantity, 0);
      const laboursTotal = serviceItems.reduce((sum, s) => sum + Number(s.rate), 0);
      const GST = 0.18;
      const taxOnParts = Math.round(sparesTotal * GST * 100) / 100;
      const taxOnServices = Math.round(laboursTotal * GST * 100) / 100;
      const totalAmount = invoice ? Number(invoice.totalAmount) : (sparesTotal + laboursTotal + taxOnParts + taxOnServices);
      const discount = invoice ? Number(invoice.discountAmount) : Number(jc.overallDiscount) || 0;
      const totalPaid = Number(jc.paidAmount) || 0;
      const dueAmount = Math.max(0, totalAmount - totalPaid);

      const advisor = jc.serviceAdvisorId ? advisorMap.get(jc.serviceAdvisorId) : null;
      const techName = advisor?.name?.toUpperCase() || 'N/A';

      return {
        invoiceNo: invoice?.invoiceNo || jc.jobCardNo,
        arrivalDate: jc.dateOfArrival ? new Date(jc.dateOfArrival).toISOString().split('T')[0] : 'N/A',
        kmsDriven: jc.odometerIn || 0,
        taxOnServices,
        taxOnParts,
        spares: sparesTotal,
        labours: laboursTotal,
        discount,
        totalAmount,
        totalPaid,
        dueAmount,
        techName,
        techFeedback: jc.ratingFeedback || '',
        customerFeedback: jc.rating ? `${jc.rating}/5` : '',
        jobCardNo: jc.jobCardNo,
      };
    });
  }

  // ── Save Estimation (single save endpoint) ────────────────────────────────
  async saveEstimation(jobCardNo: string, body: {
    spares: any[];
    services: any[];
    complaints: ComplaintDto[];
    isEstimated: boolean;
    completion: number;
    overallDiscount: number;
  }) {
    // Resolve garageId from the job card so inventory transactions use the correct branch
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo });
    const garageId = entity?.garageId;

    const [spares, services] = await Promise.all([
      this.saveSpareItems(jobCardNo, body.spares, garageId),
      this.saveServiceItems(jobCardNo, body.services),
      this.saveComplaints(jobCardNo, body.complaints),
    ]);

    if (entity) {
      await this.jobCardRepo.update(entity.id, {
        isEstimated: body.isEstimated,
        completion: body.completion,
        overallDiscount: body.overallDiscount,
      });
    }

    return this.getJobCardById(jobCardNo);
  }

  private parseJSON<T>(value: string | null | undefined, fallback: T): T {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }
}
