import { Injectable } from '@nestjs/common';
import {
  FileStorageService,
  LoggingService,
  ErrorHandlingService,
  Balance,
} from '@app/shared';
import { UpdateBalanceDto } from './dto/balance.dto';
import { RateService } from 'apps/rate-service/src/rate-service.service';

const BALANCE_FILE = process.env.BALANCE_FILE || 'data/balances';

@Injectable()
export class BalanceService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly loggingService: LoggingService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly rateService: RateService,
  ) {}

  async getUserBalance(userId: string): Promise<Balance> {
    const balances = (await this.fileStorageService.readData(
      BALANCE_FILE,
    )) as Record<string, Balance>;
    return balances[userId] || {};
  }

  async updateBalance(
    userId: string,
    dto: UpdateBalanceDto,
    isAdding: boolean,
  ): Promise<void> {
    const { asset, amount } = dto;
    if (!userId) {
      this.errorHandlingService.throwBadRequest('User ID is required');
    }

    const balances = (await this.fileStorageService.readData(
      BALANCE_FILE,
    )) as Record<string, Balance>;
    const userBalances = balances[userId] || {};

    if (isAdding) {
      userBalances[asset] = (userBalances[asset] || 0) + amount;
    } else {
      const currentBalance = userBalances[asset] || 0;

      if (currentBalance < amount) {
        this.errorHandlingService.throwBadRequest(
          'Insufficient balance to remove',
        );
      }

      userBalances[asset] -= amount;

      if (userBalances[asset] === 0) {
        delete userBalances[asset];
      }
    }

    balances[userId] = userBalances;
    await this.fileStorageService.writeData(BALANCE_FILE, balances);
  }

  async calculateTotalBalanceInCurrency(
    userId: string,
    currency: string,
  ): Promise<number> {
    const balances = await this.getUserBalance(userId);
    const rates = await this.rateService.getRates(currency);
    let totalValue = 0;

    for (const [currencyName, balance] of Object.entries(balances)) {
      const rate = rates[currencyName];
      if (rate) {
        totalValue += rate[currency] * balance;
      }
    }

    return totalValue;
  }

  async rebalance(userId: string, targetPercentages: Balance): Promise<void> {
    const balances = await this.getUserBalance(userId);

    if (Object.keys(balances).length === 0) {
      throw new Error('User has no balances to rebalance.');
    }

    const totalPercentage = Object.values(targetPercentages).reduce(
      (acc, p) => acc + p,
      0,
    );
    if (totalPercentage !== 100) {
      throw new Error('Target percentages must sum up to 100%.');
    }

    const totalValue = await this.calculateTotalBalanceInCurrency(
      userId,
      'usd',
    );

    const newBalances: Balance = {};

    for (const [asset, targetPercent] of Object.entries(targetPercentages)) {
      const rate = await this.rateService.getRate(asset, 'usd');
      const targetValue = (targetPercent / 100) * totalValue;
      const targetAmount = targetValue / rate;

      newBalances[asset] = targetAmount;
    }

    const allBalances = (await this.fileStorageService.readData(
      BALANCE_FILE,
    )) as Record<string, Balance>;
    allBalances[userId] = newBalances;

    await this.fileStorageService.writeData(BALANCE_FILE, allBalances);
  }
}
