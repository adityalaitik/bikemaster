import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply JWT guard globally — routes marked @Public() bypass it
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Apply roles guard globally — routes with @Roles() enforce role checks
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
