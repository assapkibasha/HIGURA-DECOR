import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class RentalItemInputDto {
  @IsString()
  @IsNotEmpty()
  stockId!: string;

  @IsInt()
  @Min(1)
  qty!: number;
}

export class CreateRentalDto {
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @IsDateString()
  deadlineDate!: string;

  @IsInt()
  @Min(0)
  paidAmount!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RentalItemInputDto)
  items!: RentalItemInputDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
