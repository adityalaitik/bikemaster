import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request } from '@nestjs/common';
import { AppService, JobCard, SpareItem, ServiceItem, VehicleBrand, VehicleModel, Employee, SparePartMaster, ServiceMaster, ComplaintDto, PackageDto, OfferDto, InvoiceDto, InvoiceReportDto } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('invoices')
  async getInvoices(): Promise<InvoiceReportDto[]> {
    return this.appService.getInvoices();
  }

  // ============================================================
  // SPEC 4: CUSTOMER & VEHICLE REGISTRATION
  // ============================================================
  
  @Get('vehicle-brands')
  async getBrands(): Promise<VehicleBrand[]> {
    return this.appService.getBrands();
  }

  @Get('vehicle-models')
  async getModels(@Query('brandId') brandId?: string): Promise<VehicleModel[]> {
    return this.appService.getModels(brandId);
  }

  @Get('employees')
  async getEmployees(@Query('role') role?: string): Promise<Employee[]> {
    return this.appService.getEmployees(role);
  }

  @Get('spare-parts')
  async getSpareParts(@Query('q') q?: string): Promise<SparePartMaster[]> {
    return this.appService.getSpareParts(q);
  }

  @Get('spare-parts/stock-summary')
  async getStockSummary() {
    return this.appService.getInventoryStockSummary();
  }

  @Get('spare-parts/search')
  async searchSpareParts(@Query('q') q?: string): Promise<SparePartMaster[]> {
    return this.appService.getSpareParts(q);
  }

  @Get('services-master')
  async getServicesMaster(@Query('q') q?: string): Promise<ServiceMaster[]> {
    return this.appService.getServicesMaster(q);
  }

  @Get('services/search')
  async searchServices(@Query('q') q?: string): Promise<ServiceMaster[]> {
    return this.appService.getServicesMaster(q);
  }

  @Get('customer-sources')
  async getCustomerSources(): Promise<string[]> {
    return this.appService.getCustomerSources();
  }

  // ============================================================
  // SPEC 5: SERVICE QUEUE
  // ============================================================

  @Get('job-cards')
  async getJobCards(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<JobCard[]> {
    return this.appService.getJobCards(status, search);
  }

  @Get('job-cards/stats')
  async getJobCardsStats() {
    return this.appService.getStats();
  }

  @Get('vehicles/:vehicleNo/history')
  async getVehicleHistory(@Param('vehicleNo') vehicleNo: string) {
    return this.appService.getVehicleHistory(vehicleNo);
  }

  @Get('job-cards/:id')
  async getJobCardById(@Param('id') id: string): Promise<JobCard> {
    return this.appService.getJobCardById(id);
  }

  @Post('job-cards')
  async createJobCard(@Body() data: Partial<JobCard>): Promise<JobCard> {
    return this.appService.createJobCard(data);
  }

  @Patch('job-cards/:id')
  async updateJobCard(
    @Param('id') id: string,
    @Body() data: Partial<JobCard>,
  ): Promise<JobCard> {
    return this.appService.updateJobCard(id, data);
  }

  @Post('job-cards/:id/spare-items')
  async saveSpareItems(@Param('id') id: string, @Body() body: { items: any[] }) {
    return this.appService.saveSpareItems(id, body.items);
  }

  @Post('job-cards/:id/service-items')
  async saveServiceItems(@Param('id') id: string, @Body() body: { items: any[] }) {
    return this.appService.saveServiceItems(id, body.items);
  }

  @Get('job-cards/:id/complaints')
  async getComplaints(@Param('id') id: string): Promise<ComplaintDto[]> {
    return this.appService.getComplaints(id);
  }

  @Post('job-cards/:id/complaints')
  async saveComplaints(@Param('id') id: string, @Body() body: { complaints: ComplaintDto[] }) {
    await this.appService.saveComplaints(id, body.complaints);
    return { ok: true };
  }

  @Get('job-cards/:id/estimation-context')
  async getEstimationContext(@Param('id') id: string) {
    return this.appService.getEstimationContext(id);
  }

  @Post('job-cards/:id/estimation')
  async saveEstimation(@Param('id') id: string, @Body() body: any) {
    return this.appService.saveEstimation(id, body);
  }

  @Get('packages')
  async getPackages(): Promise<PackageDto[]> {
    return this.appService.getPackages();
  }

  @Get('offers')
  async getOffers(): Promise<OfferDto[]> {
    return this.appService.getOffers();
  }

  @Patch('job-cards/:id/rating')
  async updateRating(@Param('id') id: string, @Body() body: { rating: number }): Promise<{ ok: boolean }> {
    await this.appService.updateRating(id, body.rating);
    return { ok: true };
  }

  @Post('spare-parts')
  async addSparePart(@Body() data: any): Promise<SparePartMaster> {
    return this.appService.addSparePartToMaster(data);
  }

  @Post('services-master')
  async addService(@Body() data: any): Promise<ServiceMaster> {
    return this.appService.addServiceToMaster(data);
  }

  @Patch('services-master/:id')
  async updateService(@Param('id') id: string, @Body() data: any): Promise<ServiceMaster> {
    return this.appService.updateServiceInMaster(id, data);
  }

  @Delete('services-master/:id')
  async deleteService(@Param('id') id: string) {
    return this.appService.deleteServiceFromMaster(id);
  }

  @Post('invoices/generate-pdf/:jobCardId')
  async generateInvoice(@Param('jobCardId') jobCardId: string, @Body() data: any): Promise<InvoiceDto> {
    return this.appService.generateInvoice(jobCardId, data);
  }

  // ============================================================
  // AUTHENTICATION & SESSION MANAGEMENT
  // ============================================================

  @Public()
  @Post('auth/login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('auth/me')
  getMe(@Request() req: { user: { name: string; role: string; username: string; garageCode: string } }) {
    return { user: req.user };
  }
}
