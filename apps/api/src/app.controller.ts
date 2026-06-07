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
  async getInvoices(@Query('garageId') garageId?: string): Promise<InvoiceReportDto[]> {
    return this.appService.getInvoices(garageId);
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
  async getEmployees(
    @Query('role') role?: string,
    @Query('garageId') garageId?: string,
  ): Promise<Employee[]> {
    return this.appService.getEmployees(role, garageId);
  }

  @Get('spare-parts')
  async getSpareParts(
    @Query('q') q?: string,
    @Query('garageId') garageId?: string,
  ): Promise<SparePartMaster[]> {
    return this.appService.getSpareParts(q, garageId);
  }

  @Get('spare-parts/stock-summary')
  async getStockSummary(@Query('garageId') garageId?: string) {
    return this.appService.getInventoryStockSummary(garageId);
  }

  @Get('spare-parts/search')
  async searchSpareParts(
    @Query('q') q?: string,
    @Query('garageId') garageId?: string,
  ): Promise<SparePartMaster[]> {
    return this.appService.getSpareParts(q, garageId);
  }

  @Get('services-master')
  async getServicesMaster(
    @Query('q') q?: string,
    @Query('garageId') garageId?: string,
  ): Promise<ServiceMaster[]> {
    return this.appService.getServicesMaster(q, garageId);
  }

  @Get('services/search')
  async searchServices(
    @Query('q') q?: string,
    @Query('garageId') garageId?: string,
  ): Promise<ServiceMaster[]> {
    return this.appService.getServicesMaster(q, garageId);
  }

  @Get('customer-sources')
  async getCustomerSources(@Query('garageId') garageId?: string): Promise<string[]> {
    return this.appService.getCustomerSources(garageId);
  }

  // ============================================================
  // SPEC 5: SERVICE QUEUE
  // ============================================================

  @Get('job-cards')
  async getJobCards(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('garageId') garageId?: string,
  ): Promise<JobCard[]> {
    return this.appService.getJobCards(status, search, garageId);
  }

  @Get('job-cards/stats')
  async getJobCardsStats(@Query('garageId') garageId?: string) {
    return this.appService.getStats(garageId);
  }

  @Get('vehicles/:vehicleNo/history')
  async getVehicleHistory(
    @Param('vehicleNo') vehicleNo: string,
    @Query('garageId') garageId?: string,
  ) {
    return this.appService.getVehicleHistory(vehicleNo, garageId);
  }

  @Get('job-cards/:id')
  async getJobCardById(@Param('id') id: string): Promise<JobCard> {
    return this.appService.getJobCardById(id);
  }

  @Post('job-cards')
  async createJobCard(
    @Body() data: Partial<JobCard>,
    @Query('garageId') garageId?: string,
  ): Promise<JobCard> {
    return this.appService.createJobCard(data, garageId || (data as any).garageId);
  }

  @Patch('job-cards/:id')
  async updateJobCard(
    @Param('id') id: string,
    @Body() data: Partial<JobCard>,
  ): Promise<JobCard> {
    return this.appService.updateJobCard(id, data);
  }

  @Post('job-cards/:id/spare-items')
  async saveSpareItems(
    @Param('id') id: string,
    @Body() body: { items: any[]; garageId?: string },
    @Query('garageId') garageId?: string,
  ) {
    return this.appService.saveSpareItems(id, body.items, garageId || body.garageId);
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
  async getPackages(@Query('garageId') garageId?: string): Promise<PackageDto[]> {
    return this.appService.getPackages(garageId);
  }

  @Get('offers')
  async getOffers(@Query('garageId') garageId?: string): Promise<OfferDto[]> {
    return this.appService.getOffers(garageId);
  }

  @Patch('job-cards/:id/rating')
  async updateRating(@Param('id') id: string, @Body() body: { rating: number }): Promise<{ ok: boolean }> {
    await this.appService.updateRating(id, body.rating);
    return { ok: true };
  }

  @Post('spare-parts')
  async addSparePart(
    @Body() data: any,
    @Query('garageId') garageId?: string,
  ): Promise<SparePartMaster> {
    return this.appService.addSparePartToMaster(data, garageId || data.garageId);
  }

  @Post('services-master')
  async addService(
    @Body() data: any,
    @Query('garageId') garageId?: string,
  ): Promise<ServiceMaster> {
    return this.appService.addServiceToMaster(data, garageId || data.garageId);
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
  async generateInvoice(
    @Param('jobCardId') jobCardId: string,
    @Body() data: any,
    @Query('garageId') garageId?: string,
  ): Promise<InvoiceDto> {
    return this.appService.generateInvoice(jobCardId, data, garageId);
  }

  // ============================================================
  // INVENTORY CRUD
  // ============================================================

  @Patch('spare-parts/:id')
  async updateSparePart(@Param('id') id: string, @Body() data: any) {
    return this.appService.updateSparePart(id, data);
  }

  @Delete('spare-parts/:id')
  async deleteSparePart(@Param('id') id: string) {
    return this.appService.deleteSparePart(id);
  }

  @Get('spare-parts/low-stock')
  async getLowStockAlerts(
    @Query('garageId') garageId?: string,
    @Query('threshold') threshold?: string,
  ) {
    return this.appService.getLowStockAlerts(garageId, threshold ? Number(threshold) : 10);
  }

  // ============================================================
  // VEHICLE SEARCH & MASTER DATA
  // ============================================================

  @Get('customers/search')
  async searchCustomers(
    @Query('phone') phone?: string,
    @Query('garageId') garageId?: string,
  ) {
    return this.appService.searchCustomersByPhone(phone || '', garageId);
  }

  @Get('vehicles/search')
  async searchVehicles(@Query('q') q?: string) {
    return this.appService.searchVehicles(q || '');
  }

  @Post('vehicle-brands')
  async addBrand(@Body() data: { name: string }) {
    return this.appService.addBrand(data);
  }

  @Post('vehicle-models')
  async addModel(@Body() data: { brandId: string; name: string; category?: string }) {
    return this.appService.addModel(data);
  }

  // ============================================================
  // CRM
  // ============================================================

  @Get('crm/followups')
  async getCrmFollowups(@Query('garageId') garageId?: string) {
    return this.appService.getCrmFollowups(garageId);
  }

  @Get('crm/upcoming-services')
  async getCrmUpcomingServices(@Query('garageId') garageId?: string) {
    return this.appService.getCrmUpcomingServices(garageId);
  }

  @Get('crm/dropouts')
  async getCrmDropouts(@Query('garageId') garageId?: string) {
    return this.appService.getCrmDropouts(garageId);
  }

  // ============================================================
  // ANALYTICS / BI
  // ============================================================

  @Get('analytics/kpis')
  async getAnalyticsKpis(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getAnalyticsKpis(garageId, from, to);
  }

  @Get('analytics/revenue-trend')
  async getAnalyticsRevenueTrend(@Query('garageId') garageId?: string) {
    return this.appService.getAnalyticsRevenueTrend(garageId);
  }

  @Get('analytics/by-service-type')
  async getAnalyticsByServiceType(@Query('garageId') garageId?: string) {
    return this.appService.getAnalyticsByServiceType(garageId);
  }

  // ============================================================
  // REPORTS
  // ============================================================

  @Get('reports/invoices')
  async getReportInvoices(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getReportInvoices(garageId, from, to);
  }

  @Get('reports/spares-consumption')
  async getReportSparesConsumption(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getReportSparesConsumption(garageId, from, to);
  }

  @Get('reports/technician-productivity')
  async getReportTechnicianProductivity(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getReportTechnicianProductivity(garageId, from, to);
  }

  @Get('reports/stock-movement')
  async getReportStockMovement(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getReportStockMovement(garageId, from, to);
  }

  @Get('reports/customer-sources')
  async getReportCustomerSources(@Query('garageId') garageId?: string) {
    return this.appService.getReportCustomerSources(garageId);
  }

  @Get('reports/day-book')
  async getReportDayBook(
    @Query('garageId') garageId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.getReportDayBook(garageId, from, to);
  }

  // ============================================================
  // AUTHENTICATION & SESSION MANAGEMENT
  // ============================================================

  @Public()
  @Post('auth/login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Public()
  @Post('auth/select-branch')
  selectBranch(@Body() body: { userId: string; garageId: string }) {
    return this.authService.selectBranch(body.userId, body.garageId);
  }

  @Get('auth/me')
  getMe(@Request() req: { user: { name: string; role: string; username: string; garageCode: string } }) {
    return { user: req.user };
  }
}
