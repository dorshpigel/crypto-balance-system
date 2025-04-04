import { Injectable } from '@nestjs/common';
import {
  FileStorageService,
  LoggingService,
  ErrorHandlingService,
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

  async getUserBalance(userId: string): Promise<Record<string, number>> {
    const balances = (await this.fileStorageService.readData(
      BALANCE_FILE,
    )) as Record<string, any>;
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
    )) as Record<string, Record<string, number>>;
    const userBalances = balances[userId] || {};

    if (isAdding) {
      userBalances[asset] = (userBalances[asset] || 0) + amount;
    } else {
      const currentBalance = userBalances[asset] || 0;

      if (currentBalance < dto.amount) {
        this.errorHandlingService.throwBadRequest(
          'Insufficient balance to remove',
        );
      }

      userBalances[dto.asset] -= amount;

      if (userBalances[dto.asset] === 0) {
        delete userBalances[dto.asset]; // Remove asset if balance is 0
      }
    }

    balances[userId] = userBalances;
    await this.fileStorageService.writeData(BALANCE_FILE, balances);
  }

  // Method to calculate total balance value in specified currency
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
}
