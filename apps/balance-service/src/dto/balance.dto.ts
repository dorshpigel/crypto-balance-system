import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @IsString()
  @ApiProperty({ example: 'bitcoin' })
  asset: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1.5 })
  amount: number;
}

export class BalanceDto {
  @ApiProperty({ example: 'BTC' })
  asset: string;

  @ApiProperty({ example: 1.23 })
  amount: number;
}

export class MessageDto {
  @ApiProperty({ example: 'Success' })
  message: string;
}

export class TotalValueDto {
  @ApiProperty({ example: 1000 })
  totalValue: Number;
}

