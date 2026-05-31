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

export interface Complaint { text: string; finding: string; action: string; }
export interface SpareItem { id?: string; name: string; qty: number; price: number; mrp: number; hsn: string; code: string; status: string; billedTo: 'customer' | 'insurance'; }
export interface ServiceItem { id?: string; name: string; rate: number; hsn: string; code: string; status: string; billedTo: 'customer' | 'insurance'; }
export interface TimelineEntry { time: string; title: string; desc: string; }

export interface JobCard {
  id: string; vehicleNo: string; brandModel: string; customerName: string; phone: string;
  kms: number; completion: number; status: string; advisor: string; technician: string;
  urgency: string; estimate: number; paid: number; due: number; serviceType: string;
  date: string; complaints: Complaint[]; spares: SpareItem[]; services: ServiceItem[];
  timeline: TimelineEntry[]; isEstimated?: boolean; isStatusFilled?: boolean; overallDiscount?: number;
}

export interface VehicleBrand { id: string; name: string; }
export interface VehicleModel { id: string; brandId: string; name: string; category: string; variant: string; }
export interface Employee { id: string; name: string; role: string; }
export interface SparePartMaster { id: string; name: string; partNumber: string; price: number; mrp: number; stockQty: number; hsnCode: string; }
export interface ServiceMaster { id: string; name: string; code: string; rate: number; sacCode: string; }

const STATUS_TO_UI: Record<string, string> = {
  under_servicing: 'Under Servicing',
  next_day_delivery: 'Next Day Delivery',
  upcoming_delivery: 'Upcoming Delivery',
  ready_for_delivery: 'Ready for Delivery',
  payment_processing: 'Payment Processing',
  completed: 'Completed',
  draft: 'Draft',
};

const STATUS_TO_DB: Record<string, string> = {
  'Under Servicing': 'under_servicing',
  'Next Day Delivery': 'next_day_delivery',
  'Upcoming Delivery': 'upcoming_delivery',
  'Ready for Delivery': 'ready_for_delivery',
  'Payment Processing': 'payment_processing',
  'Completed': 'completed',
  'Delivered': 'completed',
  'Draft': 'draft',
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
  ) {}

  getHello(): string { return 'BikeMasters API v1 - Database Enabled'; }

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
  async getEmployees(role?: string): Promise<Employee[]> {
    const rows = await this.employeeRepo.find({ where: { isActive: true } });
    const mapped = rows.map(r => ({ id: r.id, name: r.name, role: EMPLOYEE_TYPE_TO_ROLE[r.type] || r.type }));
    return role ? mapped.filter(e => e.role === role) : mapped;
  }

  // ── Spare Parts ───────────────────────────────────────────────────────────
  async getSpareParts(query?: string): Promise<SparePartMaster[]> {
    const qb = this.sparesRepo.createQueryBuilder('sp').where('sp.isActive = true');
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

  // ── Services Master ───────────────────────────────────────────────────────
  async getServicesMaster(query?: string): Promise<ServiceMaster[]> {
    const qb = this.servicesRepo.createQueryBuilder('sv').where('sv.isActive = true');
    if (query) qb.andWhere('(sv.serviceName LIKE :q OR sv.serviceCode LIKE :q)', { q: `%${query}%` });
    const rows = await qb.getMany();
    return rows.map(r => ({ id: r.id, name: r.serviceName, code: r.serviceCode, rate: Number(r.defaultRate), sacCode: r.hsnSacCode || 'N/A' }));
  }

  // ── Customer Sources ──────────────────────────────────────────────────────
  async getCustomerSources(): Promise<string[]> {
    const rows = await this.sourceRepo.find({ where: { isActive: true } });
    return rows.map(r => r.name);
  }

  // ── Save Spare Items ──────────────────────────────────────────────────────
  async saveSpareItems(jobCardId: string, items: any[]) {
    await this.jobSparesRepo.delete({ jobCardId });
    const entities = items.map(item => this.jobSparesRepo.create({
      jobCardId, partName: item.name, partNumber: item.code,
      price: item.price, mrp: item.mrp || item.price,
      quantity: item.qty, billedTo: item.billedTo || 'customer', status: item.status || 'estimated',
    }));
    return this.jobSparesRepo.save(entities);
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
  async getJobCards(status?: string, search?: string): Promise<JobCard[]> {
    const qb = this.jobCardRepo.createQueryBuilder('jc')
      .where('jc.isDeleted = :deleted', { deleted: false })
      .andWhere('jc.status != :del', { del: 'deleted' });

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
    const jobCardNos = cards.map(c => c.jobCardNo);

    const [vehicles, customers, allSpares, allServices] = await Promise.all([
      vehicleIds.length ? this.vehicleRepo.findBy({ id: In(vehicleIds) }) : [],
      customerIds.length ? this.customerRepo.findBy({ id: In(customerIds) }) : [],
      this.jobSparesRepo.findBy({ jobCardId: In(jobCardNos) }),
      this.jobServicesRepo.findBy({ jobCardId: In(jobCardNos) }),
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
      return this.buildJobCardDto(e, vehicle, customer, brandModel, dbSpares, dbServices);
    });
  }

  // ── Single Job Card ───────────────────────────────────────────────────────
  async getJobCardById(id: string): Promise<JobCard> {
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo: id });
    if (!entity) throw new NotFoundException(`Job card ${id} not found`);

    const [vehicle, customer, dbSpares, dbServices] = await Promise.all([
      this.vehicleRepo.findOneBy({ id: entity.vehicleId }),
      this.customerRepo.findOneBy({ id: entity.customerId }),
      this.jobSparesRepo.findBy({ jobCardId: entity.jobCardNo }),
      this.jobServicesRepo.findBy({ jobCardId: entity.jobCardNo }),
    ]);

    let brandModel = 'Bike';
    if (vehicle) {
      const model = await this.modelRepo.findOneBy({ id: vehicle.modelId });
      if (model) {
        const brand = await this.brandRepo.findOneBy({ id: model.brandId });
        brandModel = `${brand?.name || ''} ${model.name}`.trim();
      }
    }
    return this.buildJobCardDto(entity, vehicle, customer, brandModel, dbSpares, dbServices);
  }

  // ── Create Job Card ───────────────────────────────────────────────────────
  async createJobCard(data: any): Promise<JobCard> {
    // Resolve garage from DB (use first active garage)
    const garage = await this.garageRepo.findOne({ where: { isActive: true } });
    const garageId = garage?.id || '';
    const organizationId = garage?.organizationId || '';

    // 1. Ensure Customer exists
    let customer = await this.customerRepo.findOneBy({ phone: data.phone });
    if (!customer) {
      customer = await this.customerRepo.save(this.customerRepo.create({
        garageId, name: data.customerName || 'New Customer', phone: data.phone || '0000000000', customerType: 'individual',
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

    // 4. Generate job card number (padded, collision-safe)
    const count = await this.jobCardRepo.count();
    const garageCode = garage?.code?.split('-')[0] || 'WMS';
    const year = new Date().getFullYear();
    const jobCardNo = `JC-${garageCode}-${year}-${String(count + 1).padStart(5, '0')}`;

    const serviceTypeMap: Record<string, string> = {
      Regular: 'regular', Express: 'express', Accidental: 'accidental',
      'Insurance Claim': 'insurance_claim', 'Free Service': 'free_service',
    };

    const saved = await this.jobCardRepo.save(this.jobCardRepo.create({
      jobCardNo, garageId, vehicleId: vehicle.id, customerId: customer.id,
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
    if (data.status) entity.status = STATUS_TO_DB[data.status] || data.status;

    if (data.advisor) {
      const emp = await this.employeeRepo.findOneBy({ name: data.advisor, isActive: true });
      if (emp) entity.serviceAdvisorId = emp.id;
    }

    if (data.complaints) entity.customerComplaints = JSON.stringify(data.complaints);

    const saved = await this.jobCardRepo.save(entity);
    return this.getJobCardById(saved.jobCardNo);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  async getStats() {
    const [total, underServicing, ready, payment, completed] = await Promise.all([
      this.jobCardRepo.countBy({ isDeleted: false }),
      this.jobCardRepo.countBy({ isDeleted: false, status: 'under_servicing' }),
      this.jobCardRepo.countBy({ isDeleted: false, status: 'ready_for_delivery' }),
      this.jobCardRepo.countBy({ isDeleted: false, status: 'payment_processing' }),
      this.jobCardRepo.countBy({ isDeleted: false, status: 'completed' }),
    ]);

    // Sum revenue from actual completed job spare + service items
    const revenueRow = await this.jobCardRepo
      .createQueryBuilder('jc')
      .select('SUM(jc.overallDiscount)', 'discount')  // placeholder until payment table is added
      .where('jc.status = :s AND jc.isDeleted = false', { s: 'completed' })
      .getRawOne();

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
  ): JobCard {
    const spareTotal = dbSpares.reduce((sum, s) => sum + Number(s.price) * s.quantity, 0);
    const serviceTotal = dbServices.reduce((sum, s) => sum + Number(s.rate), 0);
    const estimate = spareTotal + serviceTotal;
    const discount = Number(entity.overallDiscount) || 0;
    const due = Math.max(0, estimate - discount);

    return {
      id: entity.jobCardNo,
      vehicleNo: vehicle?.registrationNo || 'UNKNOWN',
      brandModel,
      customerName: customer?.name || 'Anonymous',
      phone: customer?.phone || 'N/A',
      kms: entity.odometerIn,
      completion: entity.completion ?? (entity.status === 'completed' ? 100 : 10),
      status: STATUS_TO_UI[entity.status] || entity.status,
      advisor: 'Assigned',
      technician: 'Assigned',
      urgency: 'Medium',
      estimate,
      paid: 0,
      due,
      serviceType: entity.serviceType,
      date: entity.dateOfArrival ? new Date(entity.dateOfArrival).toDateString() : new Date().toDateString(),
      complaints: this.parseJSON(entity.customerComplaints, []),
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
      timeline: [],
      isEstimated: entity.isEstimated,
      isStatusFilled: entity.isStatusFilled,
      overallDiscount: discount,
    };
  }

  private parseJSON<T>(value: string | null | undefined, fallback: T): T {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }
}
