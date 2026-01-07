import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RentalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ReturnRentalDto } from './dto/return-rental.dto';

function startOfDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function diffDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(processedById: string, dto: CreateRentalDto) {
    const deadline = new Date(dto.deadlineDate);
    if (Number.isNaN(deadline.getTime())) throw new BadRequestException('Invalid deadlineDate');

    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: dto.customerId },
        select: { id: true, name: true, phoneE164: true },
      });
      if (!customer) throw new NotFoundException('Customer not found');

      const stockIds = dto.items.map((i) => i.stockId);
      const stocks = await tx.stock.findMany({
        where: { id: { in: stockIds } },
        select: { id: true, quantity: true, dailyLateFee: true, name: true, color: true, size: true },
      });

      if (stocks.length !== stockIds.length) throw new BadRequestException('One or more stock items not found');

      const stockById = new Map(stocks.map((s) => [s.id, s]));

      for (const item of dto.items) {
        const stock = stockById.get(item.stockId);
        if (!stock) throw new BadRequestException('One or more stock items not found');
        if (item.qty <= 0) throw new BadRequestException('Invalid qty');
        if (stock.quantity < item.qty) throw new BadRequestException('Insufficient stock');
      }

      for (const item of dto.items) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: { quantity: { decrement: item.qty } },
          select: { id: true },
        });
      }

      const rental = await tx.rental.create({
        data: {
          customerId: dto.customerId,
          deadlineDate: deadline,
          paidAmount: dto.paidAmount,
          status: 'rented',
          processedById,
          items: {
            create: dto.items.map((i) => {
              const stock = stockById.get(i.stockId)!;
              return {
                stockId: i.stockId,
                qty: i.qty,
                dailyLateFeeSnapshot: stock.dailyLateFee,
              };
            }),
          },
        },
        select: {
          id: true,
          customerId: true,
          deadlineDate: true,
          paidAmount: true,
          status: true,
          processedById: true,
          rentedOn: true,
          returnedOn: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: { id: true, stockId: true, qty: true, dailyLateFeeSnapshot: true, createdAt: true },
          },
        },
      });

      return rental;
    });
  }

  async list(input: {
    page: number;
    limit: number;
    status?: RentalStatus;
    overdue?: boolean;
    customerId?: string;
  }) {
    const page = Math.max(1, input.page);
    const limit = Math.min(100, Math.max(1, input.limit));
    const skip = (page - 1) * limit;

    const where: Prisma.RentalWhereInput = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.customerId ? { customerId: input.customerId } : {}),
      ...(input.overdue
        ? {
            status: 'rented',
            deadlineDate: { lt: new Date() },
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.rental.count({ where }),
      this.prisma.rental.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          customerId: true,
          deadlineDate: true,
          paidAmount: true,
          status: true,
          processedById: true,
          rentedOn: true,
          returnedOn: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: { id: true, stockId: true, qty: true, dailyLateFeeSnapshot: true },
          },
        },
      }),
    ]);

    return { items, page, limit, total };
  }

  async getById(id: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      select: {
        id: true,
        customerId: true,
        deadlineDate: true,
        paidAmount: true,
        status: true,
        processedById: true,
        rentedOn: true,
        returnedOn: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: { id: true, stockId: true, qty: true, dailyLateFeeSnapshot: true },
        },
        history: {
          select: { id: true, lateDays: true, totalFees: true, createdAt: true },
        },
      },
    });

    if (!rental) throw new NotFoundException('Rental not found');
    return rental;
  }

  async returnRental(processedById: string, rentalId: string, dto: ReturnRentalDto) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({
        where: { id: rentalId },
        select: {
          id: true,
          status: true,
          deadlineDate: true,
          paidAmount: true,
          customer: { select: { id: true, name: true, phoneE164: true } },
          items: {
            select: {
              id: true,
              stockId: true,
              qty: true,
              dailyLateFeeSnapshot: true,
              stock: { select: { id: true, name: true, color: true, size: true } },
            },
          },
        },
      });

      if (!rental) throw new NotFoundException('Rental not found');
      if (rental.status !== 'rented') throw new BadRequestException('Rental already returned');

      const now = new Date();
      const lateDays = Math.max(0, diffDays(now, rental.deadlineDate));

      const totalFees = rental.items.reduce((sum, i) => {
        return sum + lateDays * i.dailyLateFeeSnapshot * i.qty;
      }, 0);

      const paidAmount = rental.paidAmount + (dto.paidOnReturn ?? 0);

      await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: 'returned',
          returnedOn: now,
          paidAmount,
        },
        select: { id: true },
      });

      for (const item of rental.items) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: { quantity: { increment: item.qty } },
          select: { id: true },
        });
      }

      await tx.historyRental.create({
        data: {
          rentalId,
          customerSnapshot: rental.customer as any,
          itemsSnapshot: rental.items.map((i) => ({
            stockId: i.stockId,
            qty: i.qty,
            dailyLateFeeSnapshot: i.dailyLateFeeSnapshot,
            stock: i.stock,
          })) as any,
          rentedOn: now,
          returnedOn: now,
          lateDays,
          totalFees,
          processedById,
        },
        select: { id: true },
      });

      return {
        rentalId,
        lateDays,
        totalFees,
        paidAmount,
      };
    });
  }
}
