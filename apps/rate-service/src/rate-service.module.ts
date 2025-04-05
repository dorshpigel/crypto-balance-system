import { Module } from '@nestjs/common';
import { RateController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
  ],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateServiceModule {}
