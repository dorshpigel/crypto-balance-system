import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FileStorageService, ratesCache, rate } from '@app/shared';
import { LoggingService } from '@app/shared/logging.service';

const RATES_FILE = process.env.RATES_FILE || 'data/rates';
const CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class RateService {
  private readonly cronEnabled: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly fileStorageService: FileStorageService,
    private readonly logger: LoggingService,
    private readonly configService: ConfigService,
  ) {
    this.cronEnabled = this.configService.get('ENABLE_RATE_CRON') === 'true';
  }

  async getRates(currency: string): Promise<rate> {
    const now = Date.now();
    const cache = (await this.fileStorageService.readData(
      RATES_FILE,
    )) as ratesCache;
    const lastUpdated = cache?.__timestamp || 0;

    if (now - lastUpdated < CACHE_TTL_MS && cache[currency]) {
      this.logger.log(`Using cached rates for ${currency}`,'getRates-cache');
      return cache[currency] as rate;
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,oobit&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true&include_last_updated_at=true&vs_currencies=${currency}`;
    const response = await lastValueFrom(this.httpService.get(url));
    const rates: rate = response.data;

    const updatedCache = {
      ...cache,
      __timestamp: now,
      [currency]: rates,
    };

    await this.fileStorageService.writeData(RATES_FILE, updatedCache);
    this.logger.log(`Fetched fresh rates for ${currency}`,'getRates-fresh');
    return rates;
  }

  // ✅ Cron to refresh rates
  @Cron(CronExpression.EVERY_MINUTE)
  async refreshRatesJob() {
    if (!this.cronEnabled) return;

    const currencies = ['usd'];

    this.logger.log(`Running scheduled rate refresh...`,'CronJob-start');

    for (const currency of currencies) {
      try {
        await this.getRates(currency);
        this.logger.log(`Successfully refreshed rates for ${currency}`,'CronJob-end');
      } catch (error) {
        this.logger.error(`Failed to refresh rates for ${currency}`, 'CroJob-end');
      }
    }
  }
}
