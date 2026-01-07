import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RentalStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ReturnRentalDto } from './dto/return-rental.dto';
import { RentalsService } from './rentals.service';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateRentalDto) {
    return this.rentalsService.create(user.id, dto);
  }

  @Get()
  async list(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('status') status?: RentalStatus,
    @Query('overdue', new ParseBoolPipe({ optional: true })) overdue?: boolean,
    @Query('customerId') customerId?: string,
  ) {
    return this.rentalsService.list({ page, limit, status, overdue, customerId });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.rentalsService.getById(id);
  }

  @Patch(':id/return')
  async returnRental(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ReturnRentalDto) {
    return this.rentalsService.returnRental(user.id, id, dto);
  }
}
