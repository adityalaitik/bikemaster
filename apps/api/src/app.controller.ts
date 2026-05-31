import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request } from '@nestjs/common';
import { AppService, JobCard, SpareItem, ServiceItem } from './app.service';
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

  // ============================================================
  // SPEC 4: CUSTOMER & VEHICLE REGISTRATION
  // ============================================================
  
  @Get('vehicles/search')
  searchVehicles(@Query('q') q: string) {
    return this.appService.searchVehicles(q || '');
  }

  @Get('vehicle-brands')
  getBrands() {
    return this.appService.getBrands();
  }

  @Get('vehicle-models')
  getModels(@Query('brandId') brandId?: string) {
    return this.appService.getModels(brandId);
  }

  @Post('vehicle-brands')
  createBrand(@Body('name') name: string) {
    return this.appService.createBrand(name);
  }

  @Post('vehicle-models')
  createModel(
    @Body('brandId') brandId: string,
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('variant') variant: string,
  ) {
    return this.appService.createModel(brandId, name, category, variant);
  }

  @Post('customer-sources')
  createCustomerSource(@Body('name') name: string) {
    return this.appService.createCustomerSource(name);
  }

  @Post('employees')
  createEmployee(
    @Body('name') name: string,
    @Body('role') role: string,
  ) {
    return this.appService.createEmployee(name, role);
  }

  @Get('employees')
  getEmployees() {
    return this.appService.getEmployees();
  }

  // ============================================================
  // SPEC 5: SERVICE QUEUE
  // ============================================================

  @Get('job-cards')
  getJobCards(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): JobCard[] {
    return this.appService.getJobCards(status, search);
  }

  @Get('job-cards/stats')
  getJobCardsStats() {
    return this.appService.getJobCardsStats();
  }

  @Get('job-cards/:id')
  getJobCardById(@Param('id') id: string): JobCard {
    return this.appService.getJobCardById(id);
  }

  @Post('job-cards')
  createJobCard(@Body() data: Partial<JobCard>): JobCard {
    return this.appService.createJobCard(data);
  }

  @Patch('job-cards/:id/status')
  updateJobCardStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): JobCard {
    return this.appService.updateJobCardStatus(id, status);
  }

  @Delete('job-cards/:id')
  deleteJobCard(@Param('id') id: string) {
    return this.appService.deleteJobCard(id);
  }

  // ============================================================
  // SPEC 6: ESTIMATION
  // ============================================================

  @Get('spare-parts/search')
  searchSpares(@Query('q') q: string) {
    return this.appService.searchSpares(q || '');
  }

  @Get('services/search')
  searchServicesMaster(@Query('q') q: string) {
    return this.appService.searchServicesMaster(q || '');
  }

  @Post('job-cards/:id/spare-items')
  updateJobSpares(
    @Param('id') id: string,
    @Body('items') items: SpareItem[],
  ): JobCard {
    return this.appService.updateJobSpares(id, items);
  }

  @Post('job-cards/:id/service-items')
  updateJobServices(
    @Param('id') id: string,
    @Body('items') items: ServiceItem[],
  ): JobCard {
    return this.appService.updateJobServices(id, items);
  }

  @Get('job-cards/:id/estimate-totals')
  getJobEstimateTotals(@Param('id') id: string) {
    return this.appService.getJobEstimateTotals(id);
  }

  @Post('invoices/generate-pdf/:id')
  generateInvoicePdf(@Param('id') id: string) {
    return this.appService.generateInvoicePdf(id);
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

  // ============================================================
  // WORKSHOP, CONFIG & REPORTS DIRECTORY ENDPOINTS
  // ============================================================

  @Get('brandwise-consumables')
  getBrandwiseConsumables() {
    return this.appService.getBrandwiseConsumables();
  }

  @Post('brandwise-consumables')
  createBrandwiseConsumable(@Body() item: any) {
    return this.appService.createBrandwiseConsumable(item);
  }

  @Delete('brandwise-consumables/:id')
  deleteBrandwiseConsumable(@Param('id') id: string) {
    return this.appService.deleteBrandwiseConsumable(id);
  }

  @Get('consumable-brands')
  getConsumableBrands() {
    return this.appService.getConsumableBrands();
  }

  @Post('consumable-brands')
  createConsumableBrand(@Body() item: any) {
    return this.appService.createConsumableBrand(item);
  }

  @Delete('consumable-brands/:id')
  deleteConsumableBrand(@Param('id') id: string) {
    return this.appService.deleteConsumableBrand(id);
  }

  @Get('customer-sources-list')
  getCustomerSourcesList() {
    return this.appService.getCustomerSourcesList();
  }

  @Post('customer-sources-list')
  createCustomerSourceItem(@Body() item: any) {
    return this.appService.createCustomerSourceItem(item);
  }

  @Delete('customer-sources-list/:id')
  deleteCustomerSourceItem(@Param('id') id: string) {
    return this.appService.deleteCustomerSourceItem(id);
  }

  @Get('insurance-providers-list')
  getInsuranceProviders() {
    return this.appService.getInsuranceProviders();
  }

  @Post('insurance-providers-list')
  createInsuranceProvider(@Body() item: any) {
    return this.appService.createInsuranceProvider(item);
  }

  @Delete('insurance-providers-list/:id')
  deleteInsuranceProvider(@Param('id') id: string) {
    return this.appService.deleteInsuranceProvider(id);
  }

  @Get('spares-master-list')
  getSparesMaster() {
    return this.appService.getSparesMaster();
  }

  @Post('spares-master-list')
  createSpareMaster(@Body() item: any) {
    return this.appService.createSpareMaster(item);
  }

  @Delete('spares-master-list/:id')
  deleteSpareMaster(@Param('id') id: string) {
    return this.appService.deleteSpareMaster(id);
  }

  @Get('vehicle-categories-list')
  getVehicleCategories() {
    return this.appService.getVehicleCategories();
  }

  @Post('vehicle-categories-list')
  createVehicleCategory(@Body() item: any) {
    return this.appService.createVehicleCategory(item);
  }

  @Delete('vehicle-categories-list/:id')
  deleteVehicleCategory(@Param('id') id: string) {
    return this.appService.deleteVehicleCategory(id);
  }

  @Get('vehicle-models-master')
  getVehicleModelsMaster() {
    return this.appService.getVehicleModelsMaster();
  }

  @Post('vehicle-models-master')
  createVehicleModelMaster(@Body() item: any) {
    return this.appService.createVehicleModelMaster(item);
  }

  @Delete('vehicle-models-master/:id')
  deleteVehicleModelMaster(@Param('id') id: string) {
    return this.appService.deleteVehicleModelMaster(id);
  }

  @Get('workshop-branches')
  getWorkshopBranches() {
    return this.appService.getWorkshopBranches();
  }

  @Post('workshop-branches')
  createWorkshopBranch(@Body() item: any) {
    return this.appService.createWorkshopBranch(item);
  }

  @Get('audit-logs-list')
  getAuditLogs() {
    return this.appService.getAuditLogs();
  }

  @Get('inventory-stock-summary')
  getInventoryStock() {
    return this.appService.getInventoryStock();
  }

  @Get('packages-list')
  getPackages() {
    return this.appService.getPackages();
  }

  @Get('services-list')
  getServicesList() {
    return this.appService.getServicesList();
  }

  @Post('services-list')
  createServiceItem(@Body() item: any) {
    return this.appService.createServiceItem(item);
  }

  @Delete('services-list/:id')
  deleteServiceItem(@Param('id') id: string) {
    return this.appService.deleteServiceItem(id);
  }

  @Get('deleted-records-list')
  getDeletedRecords() {
    return this.appService.getDeletedRecords();
  }

  @Post('deleted-records-list/restore/:id')
  restoreDeletedRecord(@Param('id') id: string) {
    return this.appService.restoreDeletedRecord(id);
  }

  @Get('tech-productivity-list')
  getTechProductivity() {
    return this.appService.getTechProductivity();
  }
}
