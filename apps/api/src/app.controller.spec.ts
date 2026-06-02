import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

// ── Minimal stubs ────────────────────────────────────────────────────────────

const mockAppService = {
  getJobCards: jest.fn(),
  createJobCard: jest.fn(),
  updateJobCard: jest.fn(),
  saveEstimation: jest.fn(),
  getEstimationContext: jest.fn(),
  getOffers: jest.fn(),
  getHello: jest.fn(),
  getInvoices: jest.fn(),
  getBrands: jest.fn(),
  getModels: jest.fn(),
  getEmployees: jest.fn(),
  getSpareParts: jest.fn(),
  getInventoryStockSummary: jest.fn(),
  getServicesMaster: jest.fn(),
  getCustomerSources: jest.fn(),
  getStats: jest.fn(),
  getVehicleHistory: jest.fn(),
  getJobCardById: jest.fn(),
  saveSpareItems: jest.fn(),
  saveServiceItems: jest.fn(),
  getComplaints: jest.fn(),
  saveComplaints: jest.fn(),
  getPackages: jest.fn(),
  updateRating: jest.fn(),
  addSparePartToMaster: jest.fn(),
  addServiceToMaster: jest.fn(),
  updateServiceInMaster: jest.fn(),
  deleteServiceFromMaster: jest.fn(),
  generateInvoice: jest.fn(),
};

const mockAuthService = {
  login: jest.fn(),
};

// ── Suite ────────────────────────────────────────────────────────────────────

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  // ── GET /job-cards ─────────────────────────────────────────────────────────

  describe('GET /job-cards', () => {
    it('calls appService.getJobCards with no filters', async () => {
      mockAppService.getJobCards.mockResolvedValue([]);

      const result = await controller.getJobCards();

      expect(mockAppService.getJobCards).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual([]);
    });

    it('forwards status and search query params', async () => {
      const cards = [{ id: 'JC-001' }];
      mockAppService.getJobCards.mockResolvedValue(cards);

      const result = await controller.getJobCards('Under Servicing', 'JC-0');

      expect(mockAppService.getJobCards).toHaveBeenCalledWith('Under Servicing', 'JC-0');
      expect(result).toBe(cards);
    });
  });

  // ── POST /job-cards ────────────────────────────────────────────────────────

  describe('POST /job-cards', () => {
    it('calls appService.createJobCard with request body', async () => {
      const body = { vehicleNo: 'MH12AB1234', customerName: 'John Doe', phone: '9876543210' };
      const created = { id: 'JC-BBR-2026-00001', ...body };
      mockAppService.createJobCard.mockResolvedValue(created);

      const result = await controller.createJobCard(body as any);

      expect(mockAppService.createJobCard).toHaveBeenCalledWith(body);
      expect(result).toBe(created);
    });
  });

  // ── PATCH /job-cards/:id ───────────────────────────────────────────────────

  describe('PATCH /job-cards/:id', () => {
    it('calls appService.updateJobCard with id and body', async () => {
      const update = { status: 'Work in Progress' };
      const updated = { id: 'JC-001', status: 'Work in Progress', completion: 50 };
      mockAppService.updateJobCard.mockResolvedValue(updated);

      const result = await controller.updateJobCard('JC-001', update as any);

      expect(mockAppService.updateJobCard).toHaveBeenCalledWith('JC-001', update);
      expect(result).toBe(updated);
    });
  });

  // ── POST /job-cards/:id/estimation ────────────────────────────────────────

  describe('POST /job-cards/:id/estimation', () => {
    it('calls appService.saveEstimation with id and body', async () => {
      const body = {
        spares: [{ name: 'Oil Filter', qty: 1, price: 200, mrp: 250, hsn: 'N/A', code: 'OF-01', status: 'estimated', billedTo: 'customer' }],
        services: [],
        complaints: [],
        isEstimated: true,
        completion: 40,
        overallDiscount: 0,
      };
      const jobCard = { id: 'JC-001', isEstimated: true };
      mockAppService.saveEstimation.mockResolvedValue(jobCard);

      const result = await controller.saveEstimation('JC-001', body);

      expect(mockAppService.saveEstimation).toHaveBeenCalledWith('JC-001', body);
      expect(result).toBe(jobCard);
    });
  });

  // ── GET /job-cards/:id/estimation-context ─────────────────────────────────

  describe('GET /job-cards/:id/estimation-context', () => {
    it('calls appService.getEstimationContext with id', async () => {
      const ctx = { jobCard: { id: 'JC-001' }, spareCatalog: [], serviceCatalog: [] };
      mockAppService.getEstimationContext.mockResolvedValue(ctx);

      const result = await controller.getEstimationContext('JC-001');

      expect(mockAppService.getEstimationContext).toHaveBeenCalledWith('JC-001');
      expect(result).toBe(ctx);
    });
  });

  // ── GET /offers ────────────────────────────────────────────────────────────

  describe('GET /offers', () => {
    it('calls appService.getOffers and returns the result', async () => {
      const offers = [{ id: 'o1', title: '10% Off Oil Change', offerType: 'percentage', discountValue: 10, endDate: '2026-12-31', description: '' }];
      mockAppService.getOffers.mockResolvedValue(offers);

      const result = await controller.getOffers();

      expect(mockAppService.getOffers).toHaveBeenCalled();
      expect(result).toBe(offers);
    });

    it('returns an empty array when there are no active offers', async () => {
      mockAppService.getOffers.mockResolvedValue([]);

      const result = await controller.getOffers();

      expect(result).toEqual([]);
    });
  });
});
