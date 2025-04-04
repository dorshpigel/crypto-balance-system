import { Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '@app/shared';

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
  controllers: [RateServiceController],
  providers: [RateService],
  exports: [RateService],
})
export class RateServiceModule {}
