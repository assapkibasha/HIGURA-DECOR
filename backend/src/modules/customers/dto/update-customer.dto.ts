import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{16}$/, { message: 'nationalId must be exactly 16 digits' })
  nationalId?: string;
}
