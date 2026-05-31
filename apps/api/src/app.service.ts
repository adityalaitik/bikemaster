import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Vehicle } from './entities/vehicle.entity';
import { JobCardEntity } from './entities/job-card.entity';
import { VehicleBrandEntity } from './entities/vehicle-brand.entity';
import { VehicleModelEntity } from './entities/vehicle-model.entity';
import { SparePartEntity } from './entities/spare-part.entity';
import { ServiceEntity } from './entities/service.entity';
import { JobSpareItemEntity } from './entities/job-spare-item.entity';
import { JobServiceItemEntity } from './entities/job-service-item.entity';

export interface Complaint {
  text: string;
  finding: string;
  action: string;
}

export interface SpareItem {
  id?: string;
  name: string;
  qty: number;
  price: number;
  mrp: number;
  hsn: string;
  code: string;
  status: string;
  billedTo: 'customer' | 'insurance';
}

export interface ServiceItem {
  id?: string;
  name: string;
  rate: number;
  hsn: string;
  code: string;
  status: string;
  billedTo: 'customer' | 'insurance';
}

export interface TimelineEntry {
  time: string;
  title: string;
  desc: string;
}

export interface JobCard {
  id: string;
  vehicleNo: string;
  brandModel: string;
  customerName: string;
  phone: string;
  kms: number;
  completion: number;
  status: string;
  advisor: string;
  technician: string;
  urgency: string;
  estimate: number;
  paid: number;
  due: number;
  serviceType: string;
  date: string;
  complaints: Complaint[];
  spares: SpareItem[];
  services: ServiceItem[];
  timeline: TimelineEntry[];
  isEstimated?: boolean;
  isStatusFilled?: boolean;
  overallDiscount?: number;
}

export interface VehicleBrand { id: string; name: string; }
export interface VehicleModel { id: string; brandId: string; name: string; category: string; variant: string; }
export interface Employee { id: string; name: string; role: string; }
export interface SparePartMaster { id: string; name: string; partNumber: string; price: number; mrp: number; stockQty: number; hsnCode: string; }
export interface ServiceMaster { id: string; name: string; code: string; rate: number; sacCode: string; }

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(JobCardEntity)
    private jobCardRepo: Repository<JobCardEntity>,
    @InjectRepository(VehicleBrandEntity)
    private brandRepo: Repository<VehicleBrandEntity>,
    @InjectRepository(VehicleModelEntity)
    private modelRepo: Repository<VehicleModelEntity>,
    @InjectRepository(SparePartEntity)
    private sparesRepo: Repository<SparePartEntity>,
    @InjectRepository(ServiceEntity)
    private servicesRepo: Repository<ServiceEntity>,
    @InjectRepository(JobSpareItemEntity)
    private jobSparesRepo: Repository<JobSpareItemEntity>,
    @InjectRepository(JobServiceItemEntity)
    private jobServicesRepo: Repository<JobServiceItemEntity>,
  ) {}

  // Keep these in-memory for now as they are static lookup data
  private brands: VehicleBrand[] = [
    { id: 'b1', name: 'Honda' },
    { id: 'b2', name: 'TVS' },
    { id: 'b3', name: 'Bajaj' },
    { id: 'b4', name: 'KTM' },
    { id: 'b5', name: 'Yamaha' }
  ];

  private models: VehicleModel[] = [
    { id: 'm1', brandId: 'b1', name: 'Activa 6G', category: 'Scooter', variant: 'Deluxe' },
    { id: 'm2', brandId: 'b1', name: 'Activa 125', category: 'Scooter', variant: 'Standard' },
    { id: 'm3', brandId: 'b2', name: 'Jupiter 125', category: 'Scooter', variant: 'Disc' },
    { id: 'm4', brandId: 'b2', name: 'Ntorq 125', category: 'Scooter', variant: 'Race Edition' },
    { id: 'm5', brandId: 'b3', name: 'Pulsar 150', category: 'Motorcycle', variant: 'Neon' },
    { id: 'm6', brandId: 'b4', name: 'Duke 200', category: 'Motorcycle', variant: 'Standard' },
    { id: 'm7', brandId: 'b5', name: 'R15 V4', category: 'Motorcycle', variant: 'Racing Blue' }
  ];

  private employees: Employee[] = [
    { id: 'e1', name: 'Subhashis Sen', role: 'advisor' },
    { id: 'e2', name: 'Manoj Kumar', role: 'technician' },
    { id: 'e3', name: 'Ramesh Naik', role: 'technician' },
    { id: 'e4', name: 'Sanjay Rout', role: 'technician' },
    { id: 'e5', name: 'Anil Dash', role: 'advisor' }
  ];

  // Helper to map DB entity to UI JobCard type
  private async mapToJobCard(entity: JobCardEntity): Promise<JobCard> {
    const vehicle = await this.vehicleRepo.findOneBy({ id: entity.vehicleId });
    const customer = await this.customerRepo.findOneBy({ id: entity.customerId });
    const advisor = await this.employees.find(e => e.id === entity.serviceAdvisorId);

    // Fetch allocated items from DB
    const dbSpares = await this.jobSparesRepo.find({ where: { jobCardId: entity.jobCardNo } });
    const dbServices = await this.jobServicesRepo.find({ where: { jobCardId: entity.jobCardNo } });

    let brandModel = 'Bike';
    if (vehicle) {
      const model = await this.modelRepo.findOneBy({ id: vehicle.modelId });
      if (model) {
        const brand = await this.brandRepo.findOneBy({ id: model.brandId });
        brandModel = `${brand?.name || ''} ${model.name}`.trim();
      }
    }

    const statusMap: Record<string, string> = {
      'under_servicing': 'Under Servicing',
      'ready_for_delivery': 'Ready for Delivery',
      'payment_processing': 'Payment Processing',
      'completed': 'Completed',
      'draft': 'Draft'
    };

    return {
      id: entity.jobCardNo,
      vehicleNo: vehicle?.registrationNo || 'UNKNOWN',
      brandModel: brandModel,
      customerName: customer?.name || 'Anonymous',
      phone: customer?.phone || 'N/A',
      kms: entity.odometerIn,
      completion: entity.completion || (entity.status === 'completed' ? 100 : 10),
      status: statusMap[entity.status] || entity.status,
      advisor: advisor?.name || 'Assigned',
      technician: 'Technician',
      urgency: 'Medium',
      estimate: 450,
      paid: 0,
      due: 450,
      serviceType: entity.serviceType,
      date: entity.dateOfArrival.toDateString(),
      complaints: JSON.parse(entity.customerComplaints || '[]'),
      spares: dbSpares.map(s => ({
        id: s.id,
        name: s.partName,
        qty: s.quantity,
        price: Number(s.price),
        mrp: Number(s.mrp),
        hsn: s.partNumber, 
        code: s.partNumber,
        status: s.status,
        billedTo: s.billedTo as any
      })),
      services: dbServices.map(s => ({
        id: s.id,
        name: s.serviceName,
        rate: Number(s.rate),
        hsn: s.serviceCode,
        code: s.serviceCode,
        status: s.status,
        billedTo: s.billedTo as any
      })),
      timeline: [],
      isEstimated: entity.isEstimated,
      isStatusFilled: entity.isStatusFilled,
      overallDiscount: Number(entity.overallDiscount)
    };
  }

  // API Methods
  getHello(): string { return 'BikeMasters API v1 - Database Enabled'; }

  getBrands(): VehicleBrand[] { return this.brands; }
  getModels(brandId?: string): VehicleModel[] {
    return brandId ? this.models.filter(m => m.brandId === brandId) : this.models;
  }
  getEmployees(role?: string): Employee[] {
    return role ? this.employees.filter(e => e.role === role) : this.employees;
  }

  async getSpareParts(query?: string): Promise<SparePartMaster[]> {
    const qb = this.sparesRepo.createQueryBuilder('sp');
    if (query) {
      qb.where('sp.partName LIKE :q OR sp.partNumber LIKE :q', { q: `%${query}%` });
    }
    const entities = await qb.getMany();
    return entities.map(e => ({
      id: e.id,
      name: e.partName,
      partNumber: e.partNumber,
      price: 450, 
      mrp: 480,
      stockQty: 100,
      hsnCode: e.hsnCode || 'N/A'
    }));
  }

  async getServicesMaster(query?: string): Promise<ServiceMaster[]> {
    const qb = this.servicesRepo.createQueryBuilder('sv');
    if (query) {
      qb.where('sv.serviceName LIKE :q OR sv.serviceCode LIKE :q', { q: `%${query}%` });
    }
    const entities = await qb.getMany();
    return entities.map(e => ({
      id: e.id,
      name: e.serviceName,
      code: e.serviceCode,
      rate: Number(e.defaultRate),
      sacCode: e.hsnSacCode || 'N/A'
    }));
  }

  async saveSpareItems(jobCardId: string, items: any[]) {
    await this.jobSparesRepo.delete({ jobCardId });
    const entities = items.map(item => this.jobSparesRepo.create({
      jobCardId,
      partName: item.name,
      partNumber: item.code,
      price: item.price,
      mrp: item.mrp || item.price,
      quantity: item.qty,
      billedTo: item.billedTo || 'customer',
      status: item.status || 'estimated'
    }));
    return this.jobSparesRepo.save(entities);
  }

  async saveServiceItems(jobCardId: string, items: any[]) {
    await this.jobServicesRepo.delete({ jobCardId });
    const entities = items.map(item => this.jobServicesRepo.create({
      jobCardId,
      serviceName: item.name,
      serviceCode: item.code,
      rate: item.rate,
      billedTo: item.billedTo || 'customer',
      status: item.status || 'estimated'
    }));
    return this.jobServicesRepo.save(entities);
  }

  getCustomerSources(): string[] { return ['Walk-in', 'Referral', 'Social Media']; }

  async getJobCards(status?: string, search?: string): Promise<JobCard[]> {
    const query = this.jobCardRepo.createQueryBuilder('jc');
    
    if (status && status !== 'All Jobs') {
      const statusMap: Record<string, string> = {
        'Under Servicing': 'under_servicing',
        'Ready for Delivery': 'ready_for_delivery',
        'Payment Processing': 'payment_processing',
        'Delivered': 'completed'
      };
      
      const dbStatus = statusMap[status] || status.toLowerCase().replace(/ /g, '_');
      query.andWhere('jc.status = :status', { status: dbStatus });
    }
    
    if (search) {
      query.andWhere('jc.jobCardNo LIKE :search', { search: `%${search}%` });
    }
    
    const entities = await query.getMany();
    
    const results = await Promise.all(
      entities.map(async (e) => {
        try {
          return await this.mapToJobCard(e);
        } catch (err) {
          console.error(`[ERROR] Mapping job card ${e.jobCardNo}:`, err);
          return null;
        }
      }),
    );
    
    return results.filter((j): j is JobCard => j !== null);
  }

  async createJobCard(data: any): Promise<JobCard> {
    console.log('Creating Persistent Job Card:', data);

    // 1. Ensure Customer exists
    let customer = await this.customerRepo.findOneBy({ phone: data.phone });
    if (!customer) {
      customer = this.customerRepo.create({
        garageId: '11111111-1111-1111-1111-111111111111',
        name: data.customerName || 'New Customer',
        phone: data.phone || '0000000000',
        customerType: 'individual'
      });
      customer = await this.customerRepo.save(customer);
    }

    // 2. Resolve Brand and Model
    let brandName = 'Other';
    let modelName = 'Other';
    if (data.brandModel) {
      const parts = data.brandModel.split(' ');
      brandName = parts[0];
      modelName = parts.slice(1).join(' ') || 'General';
    }

    let brand = await this.brandRepo.findOneBy({ name: brandName });
    if (!brand) {
      brand = await this.brandRepo.save(this.brandRepo.create({
        name: brandName,
        organizationId: '8843e4fb-63d2-4376-976b-ab9b61c65eec'
      }));
    }

    let model = await this.modelRepo.findOneBy({ name: modelName, brandId: brand.id });
    if (!model) {
      model = await this.modelRepo.save(this.modelRepo.create({
        name: modelName,
        brandId: brand.id,
        fuelType: 'petrol',
        vehicleType: 'two_wheeler'
      }));
    }

    // 3. Ensure Vehicle exists
    let vehicle = await this.vehicleRepo.findOneBy({ registrationNo: data.vehicleNo });
    if (!vehicle) {
      vehicle = this.vehicleRepo.create({
        registrationNo: (data.vehicleNo || 'TEMP').toUpperCase(),
        organizationId: '8843e4fb-63d2-4376-976b-ab9b61c65eec',
        modelId: model.id,
        numberPlateColor: 'white'
      });
      vehicle = await this.vehicleRepo.save(vehicle);
    }

    // 4. Create Job Card
    const jobCount = await this.jobCardRepo.count();
    const serviceTypeMap: Record<string, string> = {
      'Regular': 'regular',
      'Express': 'express',
      'Accidental': 'accidental',
      'Insurance Claim': 'insurance_claim',
      'Free Service': 'free_service'
    };
    
    const jobCard = this.jobCardRepo.create({
      jobCardNo: `JC-BBR-2026-00${jobCount + 127}`,
      garageId: '11111111-1111-1111-1111-111111111111',
      vehicleId: vehicle.id,
      customerId: customer.id,
      odometerIn: data.kms || 0,
      status: 'under_servicing',
      serviceType: serviceTypeMap[data.serviceType] || 'regular',
      customerComplaints: JSON.stringify(data.complaints || []),
      completion: 10,
      isEstimated: false,
      isStatusFilled: false,
      overallDiscount: 0
    });

    const saved = await this.jobCardRepo.save(jobCard);
    return this.mapToJobCard(saved);
  }

  async updateJobCard(id: string, data: Partial<JobCard>): Promise<JobCard> {
    console.log(`Updating Job Card ${id}:`, data);
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo: id });
    if (!entity) throw new NotFoundException(`Job card ${id} not found`);

    // 1. Update Customer details if provided
    if (data.customerName || data.phone) {
      const customer = await this.customerRepo.findOneBy({ id: entity.customerId });
      if (customer) {
        if (data.customerName) customer.name = data.customerName;
        if (data.phone) customer.phone = data.phone;
        await this.customerRepo.save(customer);
      }
    }

    // 2. Update Vehicle details if provided
    if (data.vehicleNo) {
      const vehicle = await this.vehicleRepo.findOneBy({ id: entity.vehicleId });
      if (vehicle) {
        vehicle.registrationNo = data.vehicleNo.toUpperCase();
        await this.vehicleRepo.save(vehicle);
      }
    }

    // 3. Update Job Card details
    if (data.kms !== undefined) entity.odometerIn = data.kms;
    if (data.isEstimated !== undefined) entity.isEstimated = data.isEstimated;
    if (data.isStatusFilled !== undefined) entity.isStatusFilled = data.isStatusFilled;
    if (data.overallDiscount !== undefined) entity.overallDiscount = data.overallDiscount;
    if (data.completion !== undefined) entity.completion = data.completion;
    
    if (data.status) {
      const revStatusMap: Record<string, string> = {
        'Under Servicing': 'under_servicing',
        'Ready for Delivery': 'ready_for_delivery',
        'Payment Processing': 'payment_processing',
        'Completed': 'completed',
        'Draft': 'draft'
      };
      entity.status = revStatusMap[data.status] || data.status;
    }
    
    if (data.advisor) {
      const advisor = this.employees.find(e => e.name === data.advisor);
      if (advisor) entity.serviceAdvisorId = advisor.id;
    }

    if (data.complaints) {
      entity.customerComplaints = JSON.stringify(data.complaints);
    }

    const saved = await this.jobCardRepo.save(entity);
    return this.mapToJobCard(saved);
  }

  async getJobCardById(id: string): Promise<JobCard> {
    const entity = await this.jobCardRepo.findOneBy({ jobCardNo: id });
    if (!entity) throw new NotFoundException(`Job card ${id} not found`);
    return this.mapToJobCard(entity);
  }

  async getStats() {
    const total = await this.jobCardRepo.count();
    const ready = await this.jobCardRepo.countBy({ status: 'ready_for_delivery' });
    return {
      total,
      pending: total - ready,
      ready,
      revenue: 12500 
    };
  }
}
