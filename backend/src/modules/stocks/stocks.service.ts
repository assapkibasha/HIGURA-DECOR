import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createdById: string, dto: CreateStockDto) {
    return this.prisma.stock.create({
      data: {
        name: dto.name,
        color: dto.color,
        size: dto.size,
        quantity: dto.quantity,
        imageUrls: dto.imageUrls ?? undefined,
        dailyLateFee: dto.dailyLateFee ?? undefined,
        reorderThreshold: dto.reorderThreshold ?? undefined,
        createdById,
      },
      select: {
        id: true,
        name: true,
        color: true,
        size: true,
        quantity: true,
        imageUrls: true,
        dailyLateFee: true,
        reorderThreshold: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async list(input: { page: number; limit: number; q?: string }) {
    const page = Math.max(1, input.page);
    const limit = Math.min(100, Math.max(1, input.limit));
    const skip = (page - 1) * limit;

    const where = input.q
      ? {
          name: {
            contains: input.q,
          },
        }
      : undefined;

    const [total, items] = await Promise.all([
      this.prisma.stock.count({ where }),
      this.prisma.stock.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          color: true,
          size: true,
          quantity: true,
          imageUrls: true,
          dailyLateFee: true,
          reorderThreshold: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { items, page, limit, total };
  }

  async getById(id: string) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        color: true,
        size: true,
        quantity: true,
        imageUrls: true,
        dailyLateFee: true,
        reorderThreshold: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!stock) throw new NotFoundException('Stock not found');
    return stock;
  }

  async update(id: string, dto: UpdateStockDto) {
    const existing = await this.prisma.stock.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Stock not found');

    return this.prisma.stock.update({
      where: { id },
      data: {
        name: dto.name,
        color: dto.color,
        size: dto.size,
        quantity: dto.quantity,
        imageUrls: dto.imageUrls ?? undefined,
        dailyLateFee: dto.dailyLateFee,
        reorderThreshold: dto.reorderThreshold,
      },
      select: {
        id: true,
        name: true,
        color: true,
        size: true,
        quantity: true,
        imageUrls: true,
        dailyLateFee: true,
        reorderThreshold: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async adjust(id: string, dto: AdjustStockDto) {
    const existing = await this.prisma.stock.findUnique({
      where: { id },
      select: { id: true, quantity: true },
    });

    if (!existing) throw new NotFoundException('Stock not found');

    const nextQty = existing.quantity + dto.delta;
    if (nextQty < 0) throw new BadRequestException('Insufficient stock');

    return this.prisma.stock.update({
      where: { id },
      data: { quantity: nextQty },
      select: {
        id: true,
        name: true,
        color: true,
        size: true,
        quantity: true,
        imageUrls: true,
        dailyLateFee: true,
        reorderThreshold: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
