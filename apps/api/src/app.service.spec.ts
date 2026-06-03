import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a repository mock with jest.fn() for common methods. */
function makeRepo() {
  return {
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn((dto) => dto),
    delete: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    countBy: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    remove: jest.fn(),
    query: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getOne: jest.fn().mockResolvedValue(null),
      getRawMany: jest.fn().mockResolvedValue([]),
      getRawOne: jest.fn().mockResolvedValue(null),
    }),
  };
}

/** Build a minimal JobCardEntity for tests. */
function makeJobCard(overrides: Partial<JobCardEntity> = {}): JobCardEntity {
  return {
    id: 'uuid-jc-1',
    jobCardNo: 'JC-BBR-2026-00001',
    garageId: 'garage-1',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    serviceAdvisorId: null,
    odometerIn: 12000,
    odometerOut: null,
    status: 'under_servicing',
    serviceType: 'regular',
    isEstimated: false,
    isStatusFilled: false,
    overallDiscount: 0,
    completion: 10,
    dateOfArrival: new Date('2026-01-01'),
    promisedDeliveryDate: null,
    actualDeliveryDate: null,
    customerComplaints: '[]',
    workshopFindings: null,
    internalNotes: null,
    customerNotes: null,
    gatePassNo: null,
    gatePassIssuedAt: null,
    rating: null,
    ratingFeedback: null,
    paidAmount: 0,
    paymentBreakdown: null,
    statusHistory: [],
    isDeleted: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  } as JobCardEntity;
}

// ── Test Suite ────────────────────────────────────────────────────────────────

describe('AppService', () => {
  let service: AppService;

  // One mock repo per entity
  let jobCardRepo: ReturnType<typeof makeRepo>;
  let complaintRepo: ReturnType<typeof makeRepo>;
  let jobSparesRepo: ReturnType<typeof makeRepo>;
  let jobServicesRepo: ReturnType<typeof makeRepo>;
  let sparesRepo: ReturnType<typeof makeRepo>;
  let batchRepo: ReturnType<typeof makeRepo>;
  let customerRepo: ReturnType<typeof makeRepo>;
  let vehicleRepo: ReturnType<typeof makeRepo>;
  let brandRepo: ReturnType<typeof makeRepo>;
  let modelRepo: ReturnType<typeof makeRepo>;
  let employeeRepo: ReturnType<typeof makeRepo>;
  let sourceRepo: ReturnType<typeof makeRepo>;
  let garageRepo: ReturnType<typeof makeRepo>;
  let packageRepo: ReturnType<typeof makeRepo>;
  let packageItemRepo: ReturnType<typeof makeRepo>;
  let offerRepo: ReturnType<typeof makeRepo>;
  let invoiceRepo: ReturnType<typeof makeRepo>;
  let txnRepo: ReturnType<typeof makeRepo>;
  let servicesRepo: ReturnType<typeof makeRepo>;

  beforeEach(async () => {
    // Create fresh repos for every test
    jobCardRepo = makeRepo();
    complaintRepo = makeRepo();
    jobSparesRepo = makeRepo();
    jobServicesRepo = makeRepo();
    sparesRepo = makeRepo();
    batchRepo = makeRepo();
    customerRepo = makeRepo();
    vehicleRepo = makeRepo();
    brandRepo = makeRepo();
    modelRepo = makeRepo();
    employeeRepo = makeRepo();
    sourceRepo = makeRepo();
    garageRepo = makeRepo();
    packageRepo = makeRepo();
    packageItemRepo = makeRepo();
    offerRepo = makeRepo();
    invoiceRepo = makeRepo();
    txnRepo = makeRepo();
    servicesRepo = makeRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getRepositoryToken(Customer), useValue: customerRepo },
        { provide: getRepositoryToken(Vehicle), useValue: vehicleRepo },
        { provide: getRepositoryToken(JobCardEntity), useValue: jobCardRepo },
        { provide: getRepositoryToken(VehicleBrandEntity), useValue: brandRepo },
        { provide: getRepositoryToken(VehicleModelEntity), useValue: modelRepo },
        { provide: getRepositoryToken(SparePartEntity), useValue: sparesRepo },
        { provide: getRepositoryToken(ServiceEntity), useValue: servicesRepo },
        { provide: getRepositoryToken(JobSpareItemEntity), useValue: jobSparesRepo },
        { provide: getRepositoryToken(JobServiceItemEntity), useValue: jobServicesRepo },
        { provide: getRepositoryToken(EmployeeEntity), useValue: employeeRepo },
        { provide: getRepositoryToken(InventoryBatchEntity), useValue: batchRepo },
        { provide: getRepositoryToken(CustomerSourceEntity), useValue: sourceRepo },
        { provide: getRepositoryToken(GarageEntity), useValue: garageRepo },
        { provide: getRepositoryToken(JobComplaintEntity), useValue: complaintRepo },
        { provide: getRepositoryToken(PackageEntity), useValue: packageRepo },
        { provide: getRepositoryToken(PackageItemEntity), useValue: packageItemRepo },
        { provide: getRepositoryToken(OfferEntity), useValue: offerRepo },
        { provide: getRepositoryToken(InvoiceEntity), useValue: invoiceRepo },
        { provide: getRepositoryToken(InventoryTransactionEntity), useValue: txnRepo },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  // ── saveComplaints ──────────────────────────────────────────────────────────

  describe('saveComplaints', () => {
    it('returns early without saving when job card is not found', async () => {
      jobCardRepo.findOneBy.mockResolvedValue(null);

      await service.saveComplaints('MISSING-JC', [{ text: 'Noise', finding: '', action: 'repair_now' }]);

      expect(complaintRepo.delete).not.toHaveBeenCalled();
      expect(complaintRepo.save).not.toHaveBeenCalled();
    });

    it('deletes existing complaints then returns without saving when array is empty', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.delete.mockResolvedValue({});

      await service.saveComplaints(jc.jobCardNo, []);

      expect(complaintRepo.delete).toHaveBeenCalledWith({ jobCardId: jc.id });
      expect(complaintRepo.save).not.toHaveBeenCalled();
    });

    it('maps replace_now → repair_now (db action)', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.delete.mockResolvedValue({});
      complaintRepo.save.mockResolvedValue([]);

      await service.saveComplaints(jc.jobCardNo, [
        { text: 'Brake pad worn', finding: 'Worn out', action: 'replace_now' },
      ]);

      expect(complaintRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ action: 'repair_now', isRejected: false }),
        ]),
      );
    });

    it('maps observe → monitor (db action)', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.delete.mockResolvedValue({});
      complaintRepo.save.mockResolvedValue([]);

      await service.saveComplaints(jc.jobCardNo, [
        { text: 'Chain slack', finding: '', action: 'observe' },
      ]);

      expect(complaintRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ action: 'monitor', isRejected: false }),
        ]),
      );
    });

    it('maps declined → rejected (db action) and sets isRejected=true', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.delete.mockResolvedValue({});
      complaintRepo.save.mockResolvedValue([]);

      await service.saveComplaints(jc.jobCardNo, [
        { text: 'Engine overhaul', finding: '', action: 'declined' },
      ]);

      expect(complaintRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ action: 'rejected', isRejected: true }),
        ]),
      );
    });

    it('maps repair_now → repair_now (unchanged)', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.delete.mockResolvedValue({});
      complaintRepo.save.mockResolvedValue([]);

      await service.saveComplaints(jc.jobCardNo, [
        { text: 'Tyre puncture', finding: 'Nail found', action: 'repair_now' },
      ]);

      expect(complaintRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ action: 'repair_now' }),
        ]),
      );
    });
  });

  // ── getComplaints (tests dbActionToFrontend indirectly) ─────────────────────

  describe('getComplaints', () => {
    it('returns empty array when job card does not exist', async () => {
      jobCardRepo.findOneBy.mockResolvedValue(null);

      const result = await service.getComplaints('MISSING-JC');

      expect(result).toEqual([]);
    });

    it('maps db action monitor → observe for frontend', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.findBy.mockResolvedValue([
        { complaintText: 'Chain slack', workshopFinding: '', action: 'monitor' },
      ]);

      const result = await service.getComplaints(jc.jobCardNo);

      expect(result[0].action).toBe('observe');
    });

    it('maps db action rejected → declined for frontend', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.findBy.mockResolvedValue([
        { complaintText: 'Engine overhaul', workshopFinding: '', action: 'rejected' },
      ]);

      const result = await service.getComplaints(jc.jobCardNo);

      expect(result[0].action).toBe('declined');
    });

    it('maps db action repair_now → repair_now (unchanged)', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      complaintRepo.findBy.mockResolvedValue([
        { complaintText: 'Tyre flat', workshopFinding: 'Nail', action: 'repair_now' },
      ]);

      const result = await service.getComplaints(jc.jobCardNo);

      expect(result[0].action).toBe('repair_now');
    });
  });

  // ── saveServiceItems ─────────────────────────────────────────────────────────

  describe('saveServiceItems', () => {
    it('deletes old records then saves new items', async () => {
      jobServicesRepo.delete.mockResolvedValue({});
      const savedEntities = [{ id: 'svc-1', serviceName: 'Oil Change' }];
      jobServicesRepo.save.mockResolvedValue(savedEntities);

      const items = [
        { name: 'Oil Change', code: 'OC-01', rate: 500, billedTo: 'customer', status: 'estimated' },
      ];

      const result = await service.saveServiceItems('JC-BBR-2026-00001', items);

      expect(jobServicesRepo.delete).toHaveBeenCalledWith({ jobCardId: 'JC-BBR-2026-00001' });
      expect(jobServicesRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            jobCardId: 'JC-BBR-2026-00001',
            serviceName: 'Oil Change',
            serviceCode: 'OC-01',
            rate: 500,
            billedTo: 'customer',
            status: 'estimated',
          }),
        ]),
      );
      expect(result).toBe(savedEntities);
    });

    it('defaults billedTo to customer and status to estimated when not provided', async () => {
      jobServicesRepo.delete.mockResolvedValue({});
      jobServicesRepo.save.mockResolvedValue([]);

      await service.saveServiceItems('JC-001', [{ name: 'Wash', code: 'W-01', rate: 100 }]);

      expect(jobServicesRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ billedTo: 'customer', status: 'estimated' }),
        ]),
      );
    });
  });

  // ── saveSpareItems ───────────────────────────────────────────────────────────

  describe('saveSpareItems', () => {
    beforeEach(() => {
      // Garage lookup
      garageRepo.findOne.mockResolvedValue({ id: 'garage-1' });
      // No existing issue transactions for this job card
      txnRepo.find.mockResolvedValue([]);
      // No matching spare part by partNumber (so sparePartId lookup returns null)
      sparesRepo.findOne.mockResolvedValue(null);
      // No batch available → skip inventory deduction
      batchRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      // garageRepo.query for systemUserId
      garageRepo.query.mockRejectedValue(new Error('not accessible'));
    });

    it('deletes old spare items then saves new ones', async () => {
      const savedItems = [{ id: 'sp-1', partName: 'Oil Filter' }];
      jobSparesRepo.delete.mockResolvedValue({});
      jobSparesRepo.save.mockResolvedValue(savedItems);

      const items = [
        { name: 'Oil Filter', code: 'OF-01', qty: 1, price: 200, mrp: 250, billedTo: 'customer', status: 'estimated', sparePartId: null },
      ];

      const result = await service.saveSpareItems('JC-BBR-2026-00001', items);

      expect(jobSparesRepo.delete).toHaveBeenCalledWith({ jobCardId: 'JC-BBR-2026-00001' });
      expect(jobSparesRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            jobCardId: 'JC-BBR-2026-00001',
            partName: 'Oil Filter',
            partNumber: 'OF-01',
            quantity: 1,
            price: 200,
            mrp: 250,
            billedTo: 'customer',
            status: 'estimated',
          }),
        ]),
      );
      expect(result).toBe(savedItems);
    });

    it('saves items even when no inventory batch is available', async () => {
      jobSparesRepo.delete.mockResolvedValue({});
      jobSparesRepo.save.mockResolvedValue([{ id: 'sp-1' }]);

      const items = [{ name: 'Air Filter', code: 'AF-02', qty: 2, price: 150, mrp: 180, billedTo: 'insurance', status: 'estimated', sparePartId: null }];

      // Should not throw even though no batch exists
      await expect(service.saveSpareItems('JC-001', items)).resolves.toBeDefined();
      expect(jobSparesRepo.save).toHaveBeenCalled();
    });

    it('restores batch qty for existing transactions before saving', async () => {
      const existingTxn = { id: 'txn-1', batchId: 'batch-1', quantity: 2, referenceType: 'job_card', referenceId: 'JC-001', transactionType: 'issue' };
      txnRepo.find.mockResolvedValue([existingTxn]);
      txnRepo.remove.mockResolvedValue({});
      batchRepo.increment.mockResolvedValue({});
      jobSparesRepo.delete.mockResolvedValue({});
      jobSparesRepo.save.mockResolvedValue([]);

      await service.saveSpareItems('JC-001', []);

      expect(batchRepo.increment).toHaveBeenCalledWith({ id: 'batch-1' }, 'availableQty', 2);
      expect(txnRepo.remove).toHaveBeenCalledWith([existingTxn]);
    });
  });

  // ── updateJobCard ────────────────────────────────────────────────────────────

  describe('updateJobCard — status change and completion', () => {
    /**
     * Wire up all repos needed by updateJobCard → getJobCardById chain.
     * After the save, getJobCardById is called internally; we mock findOneBy
     * to return the updated entity on the second call.
     */
    function wireUpdateChain(entity: JobCardEntity, updatedEntity: JobCardEntity) {
      jobCardRepo.findOneBy
        .mockResolvedValueOnce(entity)       // first: find for update
        .mockResolvedValueOnce(updatedEntity); // second: find inside getJobCardById
      jobCardRepo.save.mockResolvedValue(updatedEntity);

      // Suppress all the related-entity lookups inside getJobCardById
      vehicleRepo.findOneBy.mockResolvedValue(null);
      customerRepo.findOneBy.mockResolvedValue(null);
      jobSparesRepo.findBy.mockResolvedValue([]);
      jobServicesRepo.findBy.mockResolvedValue([]);
      complaintRepo.findBy.mockResolvedValue([]);
      employeeRepo.findOneBy.mockResolvedValue(null);
      modelRepo.findOneBy.mockResolvedValue(null);
    }

    it('sets completion to 30 when status changes to Client Agreed', async () => {
      const entity = makeJobCard({ status: 'under_servicing', statusHistory: [] });
      const updated = makeJobCard({ status: 'client_agreed', completion: 30, statusHistory: [{ time: expect.any(String), status: 'client_agreed', label: 'Client Agreed', note: '' }] });
      wireUpdateChain(entity, updated);

      await service.updateJobCard(entity.jobCardNo, { status: 'Client Agreed' });

      const savedArg = jobCardRepo.save.mock.calls[0][0];
      expect(savedArg.status).toBe('client_agreed');
      expect(savedArg.completion).toBe(30);
      expect(savedArg.statusHistory).toHaveLength(1);
      expect(savedArg.statusHistory[0].status).toBe('client_agreed');
    });

    it('sets completion to 50 when status changes to Work in Progress', async () => {
      const entity = makeJobCard({ status: 'client_agreed', completion: 30, statusHistory: [] });
      wireUpdateChain(entity, makeJobCard({ status: 'work_in_progress', completion: 50 }));

      await service.updateJobCard(entity.jobCardNo, { status: 'Work in Progress' });

      const savedArg = jobCardRepo.save.mock.calls[0][0];
      expect(savedArg.status).toBe('work_in_progress');
      expect(savedArg.completion).toBe(50);
    });

    it('sets completion to 100 when status changes to Delivered', async () => {
      const entity = makeJobCard({ status: 'out_for_delivery', completion: 90, statusHistory: [] });
      wireUpdateChain(entity, makeJobCard({ status: 'delivered', completion: 100 }));

      await service.updateJobCard(entity.jobCardNo, { status: 'Delivered' });

      const savedArg = jobCardRepo.save.mock.calls[0][0];
      expect(savedArg.status).toBe('delivered');
      expect(savedArg.completion).toBe(100);
    });

    it('appends to existing statusHistory on repeated status changes', async () => {
      const existing = [{ time: '2026-01-01T00:00:00.000Z', status: 'client_agreed', label: 'Client Agreed', note: '' }];
      const entity = makeJobCard({ status: 'client_agreed', completion: 30, statusHistory: existing });
      wireUpdateChain(entity, makeJobCard({ status: 'work_in_progress', completion: 50 }));

      await service.updateJobCard(entity.jobCardNo, { status: 'Work in Progress' });

      const savedArg = jobCardRepo.save.mock.calls[0][0];
      expect(savedArg.statusHistory).toHaveLength(2);
    });

    it('throws NotFoundException when job card is not found', async () => {
      jobCardRepo.findOneBy.mockResolvedValue(null);

      await expect(service.updateJobCard('MISSING', { status: 'Delivered' })).rejects.toThrow(NotFoundException);
    });
  });

  // ── saveEstimation ───────────────────────────────────────────────────────────

  describe('saveEstimation', () => {
    it('persists spare items, service items, complaints and updates the job card', async () => {
      const jc = makeJobCard();

      // saveSpareItems internals
      garageRepo.findOne.mockResolvedValue({ id: 'garage-1' });
      txnRepo.find.mockResolvedValue([]);
      batchRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      garageRepo.query.mockRejectedValue(new Error('not accessible'));
      jobSparesRepo.delete.mockResolvedValue({});
      jobSparesRepo.save.mockResolvedValue([]);
      sparesRepo.findOne.mockResolvedValue(null);

      // saveServiceItems internals
      jobServicesRepo.delete.mockResolvedValue({});
      jobServicesRepo.save.mockResolvedValue([]);

      // saveComplaints internals
      jobCardRepo.findOneBy
        .mockResolvedValueOnce(jc)   // saveComplaints lookup
        .mockResolvedValueOnce(jc)   // saveEstimation entity lookup
        .mockResolvedValueOnce(jc);  // getJobCardById lookup
      complaintRepo.delete.mockResolvedValue({});
      complaintRepo.save.mockResolvedValue([]);

      // job card update
      jobCardRepo.update.mockResolvedValue({});

      // getJobCardById chain
      vehicleRepo.findOneBy.mockResolvedValue(null);
      customerRepo.findOneBy.mockResolvedValue(null);
      jobSparesRepo.findBy.mockResolvedValue([]);
      jobServicesRepo.findBy.mockResolvedValue([]);
      complaintRepo.findBy.mockResolvedValue([]);
      employeeRepo.findOneBy.mockResolvedValue(null);
      modelRepo.findOneBy.mockResolvedValue(null);

      const body = {
        spares: [{ name: 'Oil Filter', code: 'OF-01', qty: 1, price: 200, mrp: 250, billedTo: 'customer' as const, status: 'estimated', sparePartId: null }],
        services: [{ name: 'Oil Change', code: 'OC-01', rate: 500, billedTo: 'customer' as const, status: 'estimated' }],
        complaints: [{ text: 'Noise', finding: '', action: 'repair_now' }],
        isEstimated: true,
        completion: 40,
        overallDiscount: 0,
      };

      await service.saveEstimation(jc.jobCardNo, body);

      // Assert job card was updated with isEstimated and completion
      expect(jobCardRepo.update).toHaveBeenCalledWith(jc.id, {
        isEstimated: true,
        completion: 40,
        overallDiscount: 0,
      });
    });
  });

  // ── getJobCardById ───────────────────────────────────────────────────────────

  describe('getJobCardById', () => {
    it('throws NotFoundException when job card does not exist', async () => {
      jobCardRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getJobCardById('MISSING')).rejects.toThrow(NotFoundException);
    });

    it('returns a correctly shaped DTO when the job card exists', async () => {
      const jc = makeJobCard({ status: 'under_servicing', completion: 10 });

      jobCardRepo.findOneBy.mockResolvedValue(jc);
      vehicleRepo.findOneBy.mockResolvedValue({ id: 'vehicle-1', registrationNo: 'MH12AB1234', modelId: 'model-1' });
      customerRepo.findOneBy.mockResolvedValue({ id: 'customer-1', name: 'John Doe', phone: '9876543210' });
      jobSparesRepo.findBy.mockResolvedValue([]);
      jobServicesRepo.findBy.mockResolvedValue([]);
      complaintRepo.findBy.mockResolvedValue([]);
      employeeRepo.findOneBy.mockResolvedValue(null);
      modelRepo.findOneBy.mockResolvedValue({ id: 'model-1', name: 'Pulsar', brandId: 'brand-1' });
      brandRepo.findOneBy.mockResolvedValue({ id: 'brand-1', name: 'Bajaj' });

      const result = await service.getJobCardById(jc.jobCardNo);

      expect(result).toMatchObject({
        id: jc.jobCardNo,
        vehicleNo: 'MH12AB1234',
        brandModel: 'Bajaj Pulsar',
        customerName: 'John Doe',
        phone: '9876543210',
        kms: 12000,
        completion: 10,
        status: 'Under Servicing',
        estimate: 0,
        paid: 0,
        due: 0,
        complaints: [],
        spares: [],
        services: [],
      });
      expect(Array.isArray(result.timeline)).toBe(true);
    });

    it('uses "Bike" as brandModel when vehicle is not found', async () => {
      const jc = makeJobCard();
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      vehicleRepo.findOneBy.mockResolvedValue(null);
      customerRepo.findOneBy.mockResolvedValue(null);
      jobSparesRepo.findBy.mockResolvedValue([]);
      jobServicesRepo.findBy.mockResolvedValue([]);
      complaintRepo.findBy.mockResolvedValue([]);
      employeeRepo.findOneBy.mockResolvedValue(null);

      const result = await service.getJobCardById(jc.jobCardNo);

      expect(result.brandModel).toBe('Bike');
      expect(result.vehicleNo).toBe('UNKNOWN');
    });

    it('calculates estimate from spare and service totals', async () => {
      const jc = makeJobCard({ isEstimated: true });
      jobCardRepo.findOneBy.mockResolvedValue(jc);
      vehicleRepo.findOneBy.mockResolvedValue(null);
      customerRepo.findOneBy.mockResolvedValue(null);
      jobSparesRepo.findBy.mockResolvedValue([
        { id: 'sp-1', partName: 'Filter', partNumber: 'F-01', price: 200, mrp: 250, quantity: 2, status: 'estimated', billedTo: 'customer' },
      ]);
      jobServicesRepo.findBy.mockResolvedValue([
        { id: 'svc-1', serviceName: 'Oil Change', serviceCode: 'OC-01', rate: 500, status: 'estimated', billedTo: 'customer' },
      ]);
      complaintRepo.findBy.mockResolvedValue([]);
      employeeRepo.findOneBy.mockResolvedValue(null);

      const result = await service.getJobCardById(jc.jobCardNo);

      // (200 * 2) + 500 = 900
      expect(result.estimate).toBe(900);
    });
  });
});
