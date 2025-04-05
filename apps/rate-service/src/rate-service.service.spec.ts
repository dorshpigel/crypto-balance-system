// apps/rate-service/src/rate-service.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RateService } from './rate-service.service';
import { HttpService } from '@nestjs/axios';
import { FileStorageService, Rate } from '@app/shared';
import { LoggingService } from '@app/shared/logging.service';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('RateService', () => {
  let service: RateService;
  let httpService: HttpService;
  let fileStorageService: FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            readData: jest.fn(),
            writeData: jest.fn(),
          },
        },
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('false'),
          },
        },
      ],
    }).compile();

    service = module.get<RateService>(RateService);
    httpService = module.get<HttpService>(HttpService);
    fileStorageService = module.get<FileStorageService>(FileStorageService);
  });

  describe('getRates', () => {
    it('should return cached rates if valid', async () => {
      const mockCache = {
        __timestamp: Date.now(),
        usd: {
          bitcoin: { usd: 50000 },
        },
      };

      jest
        .spyOn(fileStorageService, 'readData')
        .mockResolvedValue(mockCache as any);

      const result = await service.getRates('usd');
      expect(result).toEqual(mockCache.usd);
    });

    it('should fetch rates if cache is expired', async () => {
      const oldCache = {
        __timestamp: Date.now() - 10 * 60 * 1000,
      };

      const apiResponse = {
        data: {
          bitcoin: { usd: 60000 },
        },
      };

      jest
        .spyOn(fileStorageService, 'readData')
        .mockResolvedValue(oldCache as any);

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(apiResponse) as any);

      const writeSpy = jest.spyOn(fileStorageService, 'writeData');

      const result = await service.getRates('usd');
      expect(result).toEqual(apiResponse.data);
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('getRate', () => {
    it('should return specific asset rate', async () => {
      jest.spyOn(service, 'getRates').mockResolvedValue({
        bitcoin: { usd: 42000 },
      } as unknown as Rate);

      const result = await service.getRate('bitcoin', 'usd');
      expect(result).toBe(42000);
    });

    it('should throw if asset rate not found', async () => {
      jest.spyOn(service, 'getRates').mockResolvedValue({} as Rate);

      await expect(service.getRate('dogecoin', 'usd')).rejects.toThrow(
        'Rate not found for dogecoin in usd',
      );
    });
  });
});
