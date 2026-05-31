import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Vehicle } from './entities/vehicle.entity';
import { JobCardEntity } from './entities/job-card.entity';
import { VehicleBrandEntity } from './entities/vehicle-brand.entity';
import { VehicleModelEntity } from './entities/vehicle-model.entity';

export interface Complaint {
  text: string;
  finding: string;
  action: string;
}

export interface SpareItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  rate: number;
  hsn: string;
  code: string;
  status: string;
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

  private spareParts: SparePartMaster[] = [
    { id: 'p1', name: 'Front Brake Shoe Assembly', partNumber: 'BP-HON-098', price: 350, mrp: 380, stockQty: 45, hsnCode: 'HSN-8708' },
    { id: 'p2', name: 'Engine Oil Premium 10W30 (800ml)', partNumber: 'SP-OIL-12', price: 450, mrp: 480, stockQty: 120, hsnCode: 'HSN-2710' },
    { id: 'p3', name: 'Spark Plug Champion Premium', partNumber: 'SPK-PLG-01', price: 120, mrp: 140, stockQty: 85, hsnCode: 'HSN-8511' }
  ];

  private servicesMaster: ServiceMaster[] = [
    { id: 's1', name: 'General Service Standard Labor', code: 'SRV-GEN-01', rate: 650, sacCode: 'SAC-9987' },
    { id: 's2', name: 'Express Washing & Polishing Bundle', code: 'SRV-WSH-02', rate: 400, sacCode: 'SAC-9987' }
  ];

  // Helper to map DB entity to UI JobCard type
  private async mapToJobCard(entity: JobCardEntity): Promise<JobCard> {
    const vehicle = await this.vehicleRepo.findOneBy({ id: entity.vehicleId });
    const customer = await this.customerRepo.findOneBy({ id: entity.customerId });
    const advisor = await this.employees.find(e => e.id === entity.serviceAdvisorId);

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
      completion: entity.status === 'completed' ? 100 : 10,
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
      spares: [],
      services: [],
      timeline: []
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
  getSpareParts(): SparePartMaster[] { return this.spareParts; }
  getServicesMaster(): ServiceMaster[] { return this.servicesMaster; }
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
          console.error(`Error mapping job card ${e.jobCardNo}:`, err);
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
    const jobCard = this.jobCardRepo.create({
      jobCardNo: `JC-BBR-2026-00${jobCount + 127}`,
      garageId: '11111111-1111-1111-1111-111111111111',
      vehicleId: vehicle.id,
      customerId: customer.id,
      odometerIn: data.kms || 0,
      status: 'under_servicing',
      serviceType: 'regular',
      customerComplaints: JSON.stringify(data.complaints || []),
    });

    const saved = await this.jobCardRepo.save(jobCard);
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
      revenue: 12500 // Mock for now
    };
  }
}
