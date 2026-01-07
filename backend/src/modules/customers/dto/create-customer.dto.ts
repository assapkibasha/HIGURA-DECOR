import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{16}$/, { message: 'nationalId must be exactly 16 digits' })
  nationalId?: string;
}
