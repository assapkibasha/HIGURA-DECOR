import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ReturnRentalDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  paidOnReturn?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
