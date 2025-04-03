import { Module } from '@nestjs/common';
import { BalanceController } from './balance-service.controller';
import { BalanceService } from './balance-service.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceServiceModule {}
