import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
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

const entities = [
  Customer, Vehicle, JobCardEntity, VehicleBrandEntity, VehicleModelEntity,
  SparePartEntity, ServiceEntity, JobSpareItemEntity, JobServiceItemEntity,
  EmployeeEntity, InventoryBatchEntity, CustomerSourceEntity, GarageEntity,
  JobComplaintEntity, PackageEntity, PackageItemEntity, OfferEntity, InvoiceEntity,
  InventoryTransactionEntity,
];

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'LeOmm@8769',
      database: 'bikemaster',
      entities,
      synchronize: false,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
