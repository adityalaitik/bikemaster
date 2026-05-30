import { Injectable, NotFoundException } from '@nestjs/common';

export interface Complaint {
  text: string;
  finding: string;
  action: string;
}

export interface SpareItem {
  name: string;
  qty: number;
  price: number;
  mrp: number;
  hsn: string;
  code: string;
  status: string;
}

export interface ServiceItem {
  name: string;
  rate: number;
  hsn: string;
  code: string;
  status: string;
}

export interface TimelineItem {
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
  timeline: TimelineItem[];
}

export interface VehicleBrand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  category: string;
  variant: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string; // technician, supervisor, advisor
}

export interface SparePartMaster {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  mrp: number;
  stockQty: number;
  hsnCode: string;
}

export interface ServiceMaster {
  id: string;
  name: string;
  code: string;
  rate: number;
  sacCode: string;
}

@Injectable()
export class AppService {
  // In-Memory Database collections
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
    { id: 'p3', name: 'Spark Plug Champion Premium', partNumber: 'SPK-PLG-01', price: 120, mrp: 140, stockQty: 85, hsnCode: 'HSN-8511' },
    { id: 'p4', name: 'Bajaj Pulsar Front Fender (Black)', partNumber: 'SP-FND-43', price: 1200, mrp: 1250, stockQty: 8, hsnCode: 'HSN-8708' },
    { id: 'p5', name: 'Front Fork Pipe Set Assembly', partNumber: 'SP-FRK-12', price: 2800, mrp: 3000, stockQty: 4, hsnCode: 'HSN-8708' },
    { id: 'p6', name: 'KTM Duke 200 Clutch Plate Kit', partNumber: 'SP-CLT-22', price: 1800, mrp: 1950, stockQty: 6, hsnCode: 'HSN-8708' },
    { id: 'p7', name: 'Rear LED Turn Indicator (Pair)', partNumber: 'SP-IND-04', price: 450, mrp: 480, stockQty: 15, hsnCode: 'HSN-8512' }
  ];

  private servicesMaster: ServiceMaster[] = [
    { id: 's1', name: 'General Service Standard Labor', code: 'SRV-GEN-01', rate: 650, sacCode: 'SAC-9987' },
    { id: 's2', name: 'Express Washing & Polishing Bundle', code: 'SRV-WSH-02', rate: 400, sacCode: 'SAC-9987' },
    { id: 's3', name: 'Fork Alignment and Straightening', code: 'SRV-FRK-01', rate: 600, sacCode: 'SAC-9987' },
    { id: 's4', name: 'Accidental Body Fitting Labor', code: 'SRV-LAB-04', rate: 800, sacCode: 'SAC-9987' },
    { id: 's5', name: 'Clutch Housing Overhaul Labor', code: 'SRV-LAB-02', rate: 550, sacCode: 'SAC-9987' },
    { id: 's6', name: 'Chain Lubrication & Adjustment', code: 'SRV-CHN-01', rate: 150, sacCode: 'SAC-9987' }
  ];

  private customerSources: string[] = ['Walk-in', 'Referral', 'Online Booking', 'Facebook', 'Google Search'];

  private jobs: JobCard[] = [
    {
      id: "JC-BBR-2026-00123",
      vehicleNo: "OD-05-AB-1234",
      brandModel: "Honda Activa 6G",
      customerName: "Aditya Pradhan",
      phone: "+91 98765 43210",
      kms: 12450,
      completion: 75,
      status: "Under Servicing",
      advisor: "Subhashis Sen",
      technician: "Manoj Kumar",
      urgency: "High",
      estimate: 1450,
      paid: 0,
      due: 1450,
      serviceType: "Regular",
      date: "29 May 2026",
      complaints: [
        { text: "Engine making heavy noise on acceleration", finding: "Loose timing chain and worn out tensioner guide", action: "repair_now" },
        { text: "Rear brake lever extremely loose", finding: "Brake shoe worn down to limit", action: "repair_now" }
      ],
      spares: [
        { name: "Front Brake Shoe Assembly", qty: 1, price: 350, mrp: 380, hsn: "HSN-8708", code: "SP-BRK-09", status: "issued" },
        { name: "Engine Oil Premium 10W30 (800ml)", qty: 1, price: 450, mrp: 480, hsn: "HSN-2710", code: "SP-OIL-12", status: "issued" }
      ],
      services: [
        { name: "General Service Standard Labor", rate: 650, hsn: "SAC-9987", code: "SRV-GEN-01", status: "completed" }
      ],
      timeline: [
        { time: "09:30 AM", title: "Job Card Created", desc: "Vehicle checked in by Advisor Subhashis Sen" },
        { time: "10:15 AM", title: "Inspection Completed", desc: "101-Point inspection completed by Manoj Kumar" },
        { time: "11:00 AM", title: "Estimation Approved", desc: "Customer approved estimate via WhatsApp link" },
        { time: "01:30 PM", title: "Servicing In-Progress", desc: "Timing chain replacement under progress" }
      ]
    },
    {
      id: "JC-BBR-2026-00124",
      vehicleNo: "OD-02-XY-9876",
      brandModel: "TVS Jupiter 125",
      customerName: "Priya Sharma",
      phone: "+91 87654 32109",
      kms: 8900,
      completion: 100,
      status: "Ready for Delivery",
      advisor: "Anil Dash",
      technician: "Ramesh Naik",
      urgency: "Medium",
      estimate: 850,
      paid: 850,
      due: 0,
      serviceType: "Express",
      date: "29 May 2026",
      complaints: [
        { text: "General routine service", finding: "Engine oil dirty, air filter moderately dirty", action: "repair_now" },
        { text: "Spark plug gap adjustment", finding: "Spark plug electrode carbonized", action: "repair_now" }
      ],
      spares: [
        { name: "Engine Oil Premium 10W30 (800ml)", qty: 1, price: 450, mrp: 480, hsn: "HSN-2710", code: "SP-OIL-12", status: "issued" }
      ],
      services: [
        { name: "Express Washing & Polishing Bundle", rate: 400, hsn: "SAC-9987", code: "SRV-WSH-02", status: "completed" }
      ],
      timeline: [
        { time: "10:00 AM", title: "Job Card Created", desc: "Express service requested" },
        { time: "10:30 AM", title: "Routine Servicing Done", desc: "Engine oil replaced & air filter cleaned" },
        { time: "11:15 AM", title: "Washing Completed", desc: "Double foam wash and tire polish done" },
        { time: "11:45 AM", title: "Ready for Delivery", desc: "Quality inspection passed by Supervisor" }
      ]
    }
  ];

  private brandwiseConsumables = [
    { id: "c1", brand: "BOSCH", name: "Engine Oil 10W30", code: "OIL-10W30" },
    { id: "c2", brand: "NIKAVI", name: "Chain Clean Spray", code: "LUBE-CH" },
    { id: "c3", brand: "HP", name: "Coolant Green", code: "CLNT-GRN" },
  ];
  private consumableBrandsList = [
    { id: "cb1", name: "HP" },
    { id: "cb2", name: "HITECH" },
    { id: "cb3", name: "MCLARINE" },
    { id: "cb4", name: "BOSCH" },
  ];
  private customerSourcesList = [
    { id: "cs1", company: "ANTIDOTE", gstin: "21AAMCS8857L1ZO", email: "info@antidote.co.in", contact: "9876543210", person: "A. Pradhan", address: "Raghunathpur", city: "Bhubaneswar", state: "Odisha", sms: "Yes", date: "2026-01-10" },
    { id: "cs2", company: "RUBRIC PROJECT PRIVATE LIMITED", gstin: "21ABBCS1234F1ZO", email: "contact@rubric.com", contact: "9937122334", person: "S. Sen", address: "Damana", city: "Bhubaneswar", state: "Odisha", sms: "Yes", date: "2026-03-15" },
  ];
  private insuranceProvidersList = [
    { id: "ip1", name: "SBI GENERAL INSURANCE CO. LTD.", gstin: "21AAMCS8857L1ZO", address: "Bhubaneswar", contact: "9999999999", email: "support@sbigeneral.in" },
    { id: "ip2", name: "HDFC General Insurance", gstin: "GSTIN123456", address: "Bhubaneswar", contact: "0123456789", email: "claims@hdfcergo.com" },
  ];
  private sparesMasterList = [
    { id: "sm1", name: "Brake Shoe Front", code: "Spares" },
    { id: "sm2", name: "Accelerator Cable", code: "Spares" },
    { id: "sm3", name: "Engine Oil 1L", code: "Consumables" },
  ];
  private vehicleCategoriesList = [
    { id: "vc1", name: "BIKE" },
    { id: "vc2", name: "SCOOTY" },
    { id: "vc3", name: "SCOOTER" },
  ];
  private vehicleModelsList = [
    { id: "vm1", brand: "Suzuki", model: "Access", variant: "SCOOTY" },
    { id: "vm2", brand: "HERO", model: "KARIZMA", variant: "BIKE" },
    { id: "vm3", brand: "HARLEY DAVIDSON", model: "X440", variant: "BIKE" },
  ];
  private workshopBranches = [
    { id: "4", name: "Bike Masters", address: "Raghunathpur", location: "RAGHUNATHPUR", pin: "751024", city: "Bhubaneswar", state: "Odisha", person: "Anil Dash", contact: "9876543210", email: "raghunathpur@bikemasters.com", tin: "TIN9988", company: "Bike Masters Pvt Ltd", cin: "CIN8877", serviceTax: "STAX8899" },
    { id: "3", name: "Bike Masters", address: "Damana", location: "DAMANA", pin: "751016", city: "Bhubaneswar", state: "Odisha", person: "Subhashis Sen", contact: "9937123456", email: "damana@bikemasters.com", tin: "TIN9989", company: "Bike Masters Pvt Ltd", cin: "CIN8878", serviceTax: "STAX8900" },
  ];
  private auditLogsList = [
    { id: "LOG-001", desc: "Vehicle Marked Done for OD-02-AX-1122", type: "Marked Done", category: "Vehicle Service", user: "Manoj Kumar", date: "2026-05-29 09:12:45" },
    { id: "LOG-002", desc: "Estimation updated for OD-33-Y-9988", type: "Estimation", category: "Vehicle Service", user: "Anil Dash", date: "2026-05-29 09:20:11" },
  ];
  private inventoryStockSummary = [
    { id: "is1", spareName: "Front Brake Shoe Assembly", brand: "Honda", model: "Activa H-Smart", variant: "SCOOTY", partBrand: "BOSCH", partNo: "BP-HON-098", totalQty: 100, consumedQty: 25, availableQty: 75, estimatedQty: 5, location: "Bin A-12" },
    { id: "is2", spareName: "Engine Oil 10W30 1L", brand: "TVS", model: "Apache", variant: "BIKE", partBrand: "HP", partNo: "OIL-HP-10W30", totalQty: 50, consumedQty: 12, availableQty: 38, estimatedQty: 2, location: "Oil Rack 3" },
  ];
  private packagesList = [
    { id: "pkg1", refId: "PKG-PMS-01", name: "PMS | ENGINE OIL AND COOLANT TOPUP AND WASH POLISH", type: "Other Services", price: 846.61, coverage: "PREMIUM SERVICE PACKAGE", user: "Aditya Pradhan", date: "2026-04-12" },
    { id: "pkg2", refId: "PKG-GEN-02", name: "PMS | GENERAL CHECKUP & ADJUSTMENT", type: "Regular Service", price: 299.00, coverage: "BASIC CHECKUP PACKAGE", user: "Anil Dash", date: "2026-04-18" },
  ];
  private servicesList = [
    { id: "s1", name: "CARBURETOR CLEAN", category: "scooty", code: "Mechanical Services", amount: 249 },
    { id: "s2", name: "REAR WHEEL RIM PAINT", category: "scooty", code: "Dent and Paint", amount: 300 },
    { id: "s3", name: "SILENCER PAINT", category: "bike", code: "Dent and Paint", amount: 249 },
    { id: "s4", name: "POLISH", category: "bike", code: "Cleaning Services", amount: 149 },
  ];
  private deletedRecordsList = [
    { id: "del1", date: "2026-05-28", vehicle: "TVS Apache 160", name: "Debasis Jena", plateNo: "OD-02-X-4422", mobile: "9853312345", invoice: "INV-2026-009", discount: 150, due: 0, supervisor: "Anil Dash", tech: "Manoj Kumar", kms: 12500, source: "Walk-in" },
    { id: "del2", date: "2026-05-27", vehicle: "Suzuki Access 125", name: "Mamata Sahu", plateNo: "OD-33-A-1100", mobile: "9438123456", invoice: "INV-2026-007", discount: 0, due: 350, supervisor: "Subhashis Sen", tech: "Ramesh Naik", kms: 8900, source: "Referral" },
  ];
  private techProductivityList = [
    { id: "tp1", jobId: "JOB-9981", vehicle: "OD-02-AX-1122", name: "Manoj Kumar", service: "CARBURETOR CLEAN", status: "Marked Done", start: "09:00 AM", stop: "09:45 AM", duration: "45 mins", speed: "45 mins", cost: 100, profit: 149 },
    { id: "tp2", jobId: "JOB-9982", vehicle: "OD-33-Y-9988", name: "Ramesh Naik", service: "SILENCER PAINT", status: "Marked Done", start: "10:15 AM", stop: "11:30 AM", duration: "75 mins", speed: "65 mins", cost: 150, profit: 99 },
  ];

  getHello(): string {
    return 'Welcome to RAMP WMS (Bike Masters) In-Memory DB API!';
  }

  // Config & Reports getters and actions
  getBrandwiseConsumables() { return this.brandwiseConsumables; }
  createBrandwiseConsumable(item: any) { this.brandwiseConsumables.push({ id: `c${this.brandwiseConsumables.length + 1}`, ...item }); return item; }
  deleteBrandwiseConsumable(id: string) { this.brandwiseConsumables = this.brandwiseConsumables.filter(i => i.id !== id); return { success: true }; }

  getConsumableBrands() { return this.consumableBrandsList; }
  createConsumableBrand(item: any) { this.consumableBrandsList.push({ id: `cb${this.consumableBrandsList.length + 1}`, ...item }); return item; }
  deleteConsumableBrand(id: string) { this.consumableBrandsList = this.consumableBrandsList.filter(i => i.id !== id); return { success: true }; }

  getCustomerSourcesList() { return this.customerSourcesList; }
  createCustomerSourceItem(item: any) { this.customerSourcesList.push({ id: `cs${this.customerSourcesList.length + 1}`, ...item }); return item; }
  deleteCustomerSourceItem(id: string) { this.customerSourcesList = this.customerSourcesList.filter(i => i.id !== id); return { success: true }; }

  getInsuranceProviders() { return this.insuranceProvidersList; }
  createInsuranceProvider(item: any) { this.insuranceProvidersList.push({ id: `ip${this.insuranceProvidersList.length + 1}`, ...item }); return item; }
  deleteInsuranceProvider(id: string) { this.insuranceProvidersList = this.insuranceProvidersList.filter(i => i.id !== id); return { success: true }; }

  getSparesMaster() { return this.sparesMasterList; }
  createSpareMaster(item: any) { this.sparesMasterList.push({ id: `sm${this.sparesMasterList.length + 1}`, ...item }); return item; }
  deleteSpareMaster(id: string) { this.sparesMasterList = this.sparesMasterList.filter(i => i.id !== id); return { success: true }; }

  getVehicleCategories() { return this.vehicleCategoriesList; }
  createVehicleCategory(item: any) { this.vehicleCategoriesList.push({ id: `vc${this.vehicleCategoriesList.length + 1}`, ...item }); return item; }
  deleteVehicleCategory(id: string) { this.vehicleCategoriesList = this.vehicleCategoriesList.filter(i => i.id !== id); return { success: true }; }

  getVehicleModelsMaster() { return this.vehicleModelsList; }
  createVehicleModelMaster(item: any) { this.vehicleModelsList.push({ id: `vm${this.vehicleModelsList.length + 1}`, ...item }); return item; }
  deleteVehicleModelMaster(id: string) { this.vehicleModelsList = this.vehicleModelsList.filter(i => i.id !== id); return { success: true }; }

  getWorkshopBranches() { return this.workshopBranches; }
  createWorkshopBranch(item: any) { this.workshopBranches.push(item); return item; }

  getAuditLogs() { return this.auditLogsList; }
  getInventoryStock() { return this.inventoryStockSummary; }
  getPackages() { return this.packagesList; }

  getServicesList() { return this.servicesList; }
  createServiceItem(item: any) { this.servicesList.push({ id: `s${this.servicesList.length + 1}`, ...item }); return item; }
  deleteServiceItem(id: string) { this.servicesList = this.servicesList.filter(i => i.id !== id); return { success: true }; }

  getDeletedRecords() { return this.deletedRecordsList; }
  restoreDeletedRecord(id: string) { this.deletedRecordsList = this.deletedRecordsList.filter(i => i.id !== id); return { success: true }; }
  
  getTechProductivity() { return this.techProductivityList; }

  getEmployees(): Employee[] {
    return this.employees;
  }

  validateLogin(credentials: any) {
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      return { success: true, user: { name: 'Aditya Pradhan', role: 'Super Admin' } };
    }
    return { success: false, message: 'Invalid credentials! Use admin / password123' };
  }

  // ============================================================
  // SPEC 4: CUSTOMER & VEHICLE REGISTRATION
  // ============================================================

  // Search models emulating typeahead
  searchVehicles(q: string): VehicleModel[] {
    const query = q.toLowerCase();
    return this.models.filter(m => 
      m.name.toLowerCase().includes(query) ||
      this.brands.find(b => b.id === m.brandId)?.name.toLowerCase().includes(query)
    );
  }

  // Get brands
  getBrands(): VehicleBrand[] {
    return this.brands;
  }

  // Get models by Brand
  getModels(brandId?: string): VehicleModel[] {
    if (brandId) {
      return this.models.filter(m => m.brandId === brandId);
    }
    return this.models;
  }

  // Add brand inline
  createBrand(name: string): VehicleBrand {
    const brand: VehicleBrand = { id: `b${this.brands.length + 1}`, name };
    this.brands.push(brand);
    return brand;
  }

  // Add model inline
  createModel(brandId: string, name: string, category: string, variant: string): VehicleModel {
    const model: VehicleModel = {
      id: `m${this.models.length + 1}`,
      brandId,
      name,
      category,
      variant
    };
    this.models.push(model);
    return model;
  }

  // Add customer sources
  createCustomerSource(name: string) {
    this.customerSources.push(name);
    return { name };
  }

  // Add employee (technician/advisor) inline
  createEmployee(name: string, role: string): Employee {
    const emp: Employee = { id: `e${this.employees.length + 1}`, name, role };
    this.employees.push(emp);
    return emp;
  }

  // ============================================================
  // SPEC 5: SERVICE QUEUE
  // ============================================================

  // Get Job Cards
  getJobCards(status?: string, search?: string): JobCard[] {
    let result = [...this.jobs];

    if (status && status !== 'All Jobs') {
      result = result.filter(j => j.status === status);
    }

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      result = result.filter(j => 
        j.customerName.toLowerCase().includes(q) ||
        j.phone.includes(q) ||
        j.vehicleNo.toLowerCase().includes(q) ||
        j.brandModel.toLowerCase().includes(q)
      );
    }

    return result;
  }

  // Get Status counts stats emulations
  getJobCardsStats() {
    return {
      all: this.jobs.length,
      underServicing: this.jobs.filter(j => j.status === 'Under Servicing').length,
      ready: this.jobs.filter(j => j.status === 'Ready for Delivery').length,
      payment: this.jobs.filter(j => j.status === 'Payment Processing').length,
      completed: this.jobs.filter(j => j.status === 'Completed').length
    };
  }

  // Get specific Job Card
  getJobCardById(id: string): JobCard {
    const job = this.jobs.find(j => j.id === id);
    if (!job) {
      throw new NotFoundException(`Job card with ID ${id} not found`);
    }
    return job;
  }

  // Create atomic Job Card
  createJobCard(data: Partial<JobCard>): JobCard {
    const newId = `JC-BBR-2026-00${this.jobs.length + 127}`;
    const newJob: JobCard = {
      id: newId,
      vehicleNo: (data.vehicleNo || 'OD-05-XX-9999').toUpperCase(),
      brandModel: data.brandModel || 'Hero Splendor',
      customerName: data.customerName || 'Anonymous Customer',
      phone: data.phone || '+91 99999 88888',
      kms: data.kms || 5000,
      completion: 10,
      status: 'Under Servicing',
      advisor: data.advisor || 'Subhashis Sen',
      technician: data.technician || 'Manoj Kumar',
      urgency: data.urgency || 'Medium',
      estimate: data.estimate || 450,
      paid: 0,
      due: data.estimate || 450,
      serviceType: data.serviceType || 'Regular',
      date: '29 May 2026',
      complaints: data.complaints || [
        { text: 'General routine maintenance check-up', finding: 'First routine service', action: 'repair_now' }
      ],
      spares: data.spares || [],
      services: data.services || [
        { name: 'General Washing and Detailing', rate: 450, hsn: 'SAC-9987', code: 'SRV-WSH-01', status: 'estimated' }
      ],
      timeline: [
        { time: 'Just Now', title: 'Customer Registered', desc: 'Registered in database' },
        { time: 'Just Now', title: 'Job Card Opened', desc: `Assigned advisor ${data.advisor || 'Subhashis Sen'}` }
      ]
    };

    this.jobs.unshift(newJob);
    return newJob;
  }

  // Update Status
  updateJobCardStatus(id: string, status: string): JobCard {
    const job = this.getJobCardById(id);
    job.status = status;
    if (status === 'Completed') {
      job.completion = 100;
      job.due = 0;
      job.paid = job.estimate;
    } else if (status === 'Ready for Delivery') {
      job.completion = 100;
    }
    
    job.timeline.push({
      time: 'Just Now',
      title: 'Status Updated',
      desc: `Moved status step to ${status}`
    });
    
    return job;
  }

  // Delete Job Card
  deleteJobCard(id: string): { success: boolean } {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Job card with ID ${id} not found`);
    }
    this.jobs.splice(idx, 1);
    return { success: true };
  }

  // ============================================================
  // SPEC 6: ESTIMATION & JOB BILLING
  // ============================================================

  // Search Spares Master
  searchSpares(q: string): SparePartMaster[] {
    const query = q.toLowerCase();
    return this.spareParts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.partNumber.toLowerCase().includes(query)
    );
  }

  // Search Services Master
  searchServicesMaster(q: string): ServiceMaster[] {
    const query = q.toLowerCase();
    return this.servicesMaster.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.code.toLowerCase().includes(query)
    );
  }

  // Save / Update Spares allocated to Job Card (Bulk Upsert)
  updateJobSpares(id: string, items: SpareItem[]): JobCard {
    const job = this.getJobCardById(id);
    job.spares = items;
    this.recalculateEstimateTotals(job);
    return job;
  }

  // Save / Update Services allocated to Job Card (Bulk Upsert)
  updateJobServices(id: string, items: ServiceItem[]): JobCard {
    const job = this.getJobCardById(id);
    job.services = items;
    this.recalculateEstimateTotals(job);
    return job;
  }

  // Calculate totals and updates job estimates
  private recalculateEstimateTotals(job: JobCard) {
    const spareTotal = job.spares.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const serviceTotal = job.services.reduce((sum, item) => sum + item.rate, 0);
    
    job.estimate = spareTotal + serviceTotal;
    job.due = job.estimate - job.paid;
  }

  // Retrieve computed totals split
  getJobEstimateTotals(id: string) {
    const job = this.getJobCardById(id);
    const spareSubtotal = job.spares.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const serviceSubtotal = job.services.reduce((sum, item) => sum + item.rate, 0);
    
    const subtotal = spareSubtotal + serviceSubtotal;
    const gstAmount = Math.round(subtotal * 0.18); // default emulated 18% GST
    const netTotal = subtotal + gstAmount;

    return {
      subtotal,
      discount: 0,
      tax: gstAmount,
      total: netTotal,
      customerDues: netTotal - job.paid,
      paid: job.paid
    };
  }

  // Generate In-Memory Invoice PDF Layout Stream Mock
  generateInvoicePdf(id: string) {
    const job = this.getJobCardById(id);
    const totals = this.getJobEstimateTotals(id);

    return {
      invoiceNo: `INV-BBR-2026-00${Math.floor(Math.random() * 900) + 100}`,
      jobCardNo: job.id,
      customerName: job.customerName,
      vehicleNo: job.vehicleNo,
      brandModel: job.brandModel,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      pdfUrl: `https://bikemasters.storage.azure.in/invoices/inv-bbr-${job.id.toLowerCase()}.pdf`
    };
  }
}
