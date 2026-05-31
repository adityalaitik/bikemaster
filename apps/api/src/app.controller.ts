import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request } from '@nestjs/common';
import { AppService, JobCard, SpareItem, ServiceItem, VehicleBrand, VehicleModel, Employee, SparePartMaster, ServiceMaster } from './app.service';
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
  
  @Get('vehicle-brands')
  getBrands(): VehicleBrand[] {
    return this.appService.getBrands();
  }

  @Get('vehicle-models')
  getModels(@Query('brandId') brandId?: string): VehicleModel[] {
    return this.appService.getModels(brandId);
  }

  @Get('employees')
  getEmployees(@Query('role') role?: string): Employee[] {
    return this.appService.getEmployees(role);
  }

  @Get('spare-parts')
  async getSpareParts(@Query('q') q?: string): Promise<SparePartMaster[]> {
    return this.appService.getSpareParts(q);
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
  getCustomerSources(): string[] {
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
