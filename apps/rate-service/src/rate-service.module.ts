import { Module } from '@nestjs/common';
import { RateController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, 
          limit: 1000,
        },
      ],
    }),
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
