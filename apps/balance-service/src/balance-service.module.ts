import { Module } from '@nestjs/common';
import { BalanceController } from './balance-service.controller';
import { BalanceService } from './balance-service.service';
import { SharedModule } from '@app/shared';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';

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
    HttpModule.register({
      baseURL: process.env.RATE_SERVICE_URL || 'http://localhost:3001',
      timeout: 3000,
    }),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceServiceModule {}
