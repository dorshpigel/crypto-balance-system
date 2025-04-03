import { Injectable } from '@nestjs/common';
import { FileStorageService, LoggingService, ErrorHandlingService } from '@app/shared';
import { UpdateBalanceDto } from './dto/balance.dto';

const BALANCE_FILE = 'data/balances.json';

@Injectable()
export class BalanceService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly loggingService: LoggingService,
    private readonly errorHandlingService: ErrorHandlingService
  ) {}

  async getUserBalance(userId: string): Promise<Record<string, number>> {
    const balances = await this.fileStorageService.readData(BALANCE_FILE) as Record<string, any>;
    return balances[userId] || {};
  }

  async updateBalance(userId: string, dto: UpdateBalanceDto, isAdding: boolean): Promise<void> {
    if (!userId) this.errorHandlingService.throwBadRequest('User ID is required');
    
    const balances = await this.fileStorageService.readData(BALANCE_FILE) as Record<string, Record<string, number>>;
    balances[userId] = balances[userId] || {};

    if (isAdding) {
      balances[userId][dto.asset] = (balances[userId][dto.asset] || 0) + dto.amount;
    } else {
      if (!balances[userId][dto.asset] || balances[userId][dto.asset] < dto.amount) {
        this.errorHandlingService.throwBadRequest('Insufficient balance to remove');
      }
      balances[userId][dto.asset] -= dto.amount;
      if (balances[userId][dto.asset] === 0) delete balances[userId][dto.asset]; // Remove asset if 0
    }

    await this.fileStorageService.writeData(BALANCE_FILE, balances);
  }
}
