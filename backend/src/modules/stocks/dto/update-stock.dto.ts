import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStockDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  dailyLateFee?: number;
}
