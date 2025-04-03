import { IsString, IsNumber, Min } from 'class-validator';

export class UpdateBalanceDto {
  @IsString()
  asset: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
