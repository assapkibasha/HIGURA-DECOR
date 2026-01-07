import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateStockDto) {
    return this.stocksService.create(user.id, dto);
  }

  @Get()
  async list(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('q') q?: string,
  ) {
    return this.stocksService.list({ page, limit, q });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.stocksService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.stocksService.update(id, dto);
  }

  @Patch(':id/adjust')
  async adjust(@Param('id') id: string, @Body() dto: AdjustStockDto) {
    return this.stocksService.adjust(id, dto);
  }
}
