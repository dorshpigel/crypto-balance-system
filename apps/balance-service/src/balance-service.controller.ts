import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { BalanceService } from './balance-service.service';
import { UpdateBalanceDto } from './dto/balance.dto';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string) {
    return this.balanceService.getUserBalance(userId);
  }

  @Post('add')
  async addBalance(@Headers('X-User-ID') userId: string, @Body() dto: UpdateBalanceDto) {
    await this.balanceService.updateBalance(userId, dto, true);
    return { message: 'Asset added successfully' };
  }

  @Post('remove')
  async removeBalance(@Headers('X-User-ID') userId: string, @Body() dto: UpdateBalanceDto) {
    await this.balanceService.updateBalance(userId, dto, false);
    return { message: 'Asset removed successfully' };
  }
}
