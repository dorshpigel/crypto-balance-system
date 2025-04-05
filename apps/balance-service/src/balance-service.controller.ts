import { Controller, Get, Post, Body, Headers, Query } from '@nestjs/common';
import { BalanceService } from './balance-service.service';
import {
  UpdateBalanceDto,
  BalanceDto,
  MessageDto,
  TotalValueDto,
} from './dto/balance.dto';
import { Balance } from '@app/shared';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Get user balance' })
  @ApiResponse({
    status: 200,
    description: 'User balance returned.',
    type: [BalanceDto],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get()
  async getBalances(@Headers('X-User-ID') userId: string): Promise<Balance> {
    return this.balanceService.getUserBalance(userId);
  }

  @ApiOperation({ summary: 'Post user balance addition' })
  @ApiResponse({
    status: 200,
    description: 'Success message',
    type: MessageDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Post('add')
  async addBalance(
    @Headers('X-User-ID') userId: string,
    @Body() dto: UpdateBalanceDto,
  ): Promise<MessageDto> {
    await this.balanceService.updateBalance(userId, dto, true);
    return { message: 'Asset added successfully' };
  }

  @ApiOperation({ summary: 'Post user balance reduction' })
  @ApiResponse({
    status: 200,
    description: 'Success message',
    type: MessageDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Post('remove')
  async removeBalance(
    @Headers('X-User-ID') userId: string,
    @Body() dto: UpdateBalanceDto,
  ): Promise<MessageDto> {
    await this.balanceService.updateBalance(userId, dto, false);
    return { message: 'Asset removed successfully' };
  }

  @ApiOperation({ summary: 'Get user total value of balance' })
  @ApiResponse({
    status: 200,
    description: 'Returns total-value',
    type: TotalValueDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get('total-value')
  async getTotalValue(
    @Headers('X-User-ID') userId: string,
    @Query('currency') currency: string,
  ): Promise<TotalValueDto> {
    const totalValue =
      await this.balanceService.calculateTotalBalanceInCurrency(
        userId,
        currency,
      );
    return { totalValue };
  }

  @ApiOperation({ summary: 'Post user balance addition' })
  @ApiResponse({
    status: 200,
    description: 'Rebalance users holdings according to targetPercentages',
    type: MessageDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Post('rebalance')
  async rebalance(
    @Headers('X-User-ID') userId: string,
    @Body() targetPercentages: Balance,
  ): Promise<MessageDto> {
    await this.balanceService.rebalance(userId, targetPercentages);
    return { message: 'Rebalance successful' };
  }
}
