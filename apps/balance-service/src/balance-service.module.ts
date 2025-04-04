import { Module } from '@nestjs/common';
import { BalanceController } from './balance-service.controller';
import { BalanceService } from './balance-service.service';
import { SharedModule } from '@app/shared';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateServiceModule } from 'apps/rate-service/src/rate-service.module';

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
    SharedModule,
    RateServiceModule
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceServiceModule {}
