import { Controller, Get, Param, Query } from '@nestjs/common';
import { RateService } from './rate-service.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getRates(@Query('currency') currency: string) {
    return this.rateService.getRates(currency);
  }

  @Get('/:asset')
  async getRate(
    @Param('asset') asset: string,
    @Query('currency') currency: string,
  ) {
    return this.rateService.getRate(asset, currency);
  }
}
