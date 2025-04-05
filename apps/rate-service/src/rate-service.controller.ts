import { Controller, Get, Param, Query } from '@nestjs/common';
import { RateService } from './rate-service.service';
import { ApiResponse,ApiOperation } from '@nestjs/swagger';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @ApiOperation({ summary: 'Get rates per provided currency' })
  @ApiResponse({
    status: 200,
    description: 'Rate per provided currency returned.',
  })
  @ApiResponse({ status: 404, description: 'Rates not found.' })
  @Get()
  async getRates(@Query('currency') currency: string) {
    return this.rateService.getRates(currency);
  }

  @ApiOperation({ summary: 'Get rate per provided asset and currency' })
  @ApiResponse({
    status: 200,
    description: 'Rate per provided currency returned.',
  })
  @ApiResponse({ status: 404, description: 'Rate not found.',type: Number })
  @Get('/:asset')
  async getRate(
    @Param('asset') asset: string,
    @Query('currency') currency: string,
  ) {
    return this.rateService.getRate(asset, currency);
  }
}
