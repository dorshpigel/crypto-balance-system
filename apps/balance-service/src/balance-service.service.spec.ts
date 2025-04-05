import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance-service.service';
import {
  FileStorageService,
  LoggingService,
  ErrorHandlingService,
} from '@app/shared';
import { RateService } from '@app/rate-service';
import { UpdateBalanceDto } from './dto/balance.dto';
import { HttpService } from '@nestjs/axios'; 


describe('BalanceService', () => {
  let service: BalanceService;
  let mockFileStorage: Partial<FileStorageService>;
  let mockRateService: Partial<RateService>;
  let mockErrorHandling: Partial<ErrorHandlingService>;

  beforeEach(async () => {
    mockFileStorage = {
      readData: jest.fn().mockResolvedValue({
        '123': { bitcoin: 1.5, ethereum: 2 },
      }),
      writeData: jest.fn(),
    };

    mockRateService = {
      getRates: jest.fn().mockResolvedValue({
        bitcoin: { usd: 30000 },
        ethereum: { usd: 2000 },
      }),
      getRate: jest.fn().mockImplementation((asset, currency) => {
        const rates = {
          bitcoin: 30000,
          ethereum: 2000,
          oobit: 1,
        };
        return rates[asset];
      }),
    };

    mockErrorHandling = {
      throwBadRequest: jest.fn((msg) => {
        throw new Error(msg);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        { provide: FileStorageService, useValue: mockFileStorage },
        { provide: LoggingService, useValue: { log: jest.fn(), error: jest.fn() } },
        { provide: ErrorHandlingService, useValue: mockErrorHandling },
        { provide: RateService, useValue: mockRateService },
        { provide: HttpService, useValue: { get: jest.fn() } }, // 👈 mock HttpService
      ],
    }).compile();
    

    service = module.get<BalanceService>(BalanceService);
  });

  describe('getUserBalance', () => {
    it('should return user balance if exists', async () => {
      const result = await service.getUserBalance('123');
      expect(result).toEqual({ bitcoin: 1.5, ethereum: 2 });
    });

    it('should return empty object if user not found', async () => {
      (mockFileStorage.readData as jest.Mock).mockResolvedValue({});
      const result = await service.getUserBalance('ghost');
      expect(result).toEqual({});
    });
  });

  describe('updateBalance', () => {
    it('should add balance for user', async () => {
      await service.updateBalance(
        '123',
        { asset: 'bitcoin', amount: 1 } as UpdateBalanceDto,
        true,
      );
      expect(mockFileStorage.writeData).toHaveBeenCalled();
    });

    it('should subtract balance for user', async () => {
      await service.updateBalance(
        '123',
        { asset: 'bitcoin', amount: 1 } as UpdateBalanceDto,
        false,
      );
      expect(mockFileStorage.writeData).toHaveBeenCalled();
    });

    it('should throw if balance insufficient', async () => {
      await expect(() =>
        service.updateBalance(
          '123',
          { asset: 'bitcoin', amount: 999 } as UpdateBalanceDto,
          false,
        ),
      ).rejects.toThrow('Insufficient balance to remove');
    });

    it('should throw if userId is missing', async () => {
      await expect(() =>
        service.updateBalance(
          '',
          { asset: 'bitcoin', amount: 1 } as UpdateBalanceDto,
          true,
        ),
      ).rejects.toThrow('User ID is required');
    });
  });

  describe('rebalance', () => {

    it('should throw if no balances exist', async () => {
      (service.getUserBalance as jest.Mock) = jest.fn().mockResolvedValue({});
      await expect(service.rebalance('123', { bitcoin: 100 })).rejects.toThrow(
        'User has no balances to rebalance.',
      );
    });

    it('should throw if target percentages don’t sum to 100', async () => {
      await expect(
        service.rebalance('123', { bitcoin: 80, ethereum: 10 }),
      ).rejects.toThrow('Target percentages must sum up to 100%.');
    });
  });
});
