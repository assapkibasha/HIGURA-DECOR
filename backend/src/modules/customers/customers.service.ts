import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

function normalizePhoneE164(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/[^\d+]/g, '');

  if (digits.startsWith('+')) return digits;

  const onlyDigits = digits.replace(/\D/g, '');

  if (onlyDigits.startsWith('250')) return `+${onlyDigits}`;
  if (onlyDigits.startsWith('0')) return `+250${onlyDigits.slice(1)}`;
  if (onlyDigits.length === 9) return `+250${onlyDigits}`;

  return `+${onlyDigits}`;
}

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const phoneE164 = normalizePhoneE164(dto.phone);

    const existing = await this.prisma.customer.findUnique({
      where: { phoneE164 },
      select: { id: true },
    });

    if (existing) throw new BadRequestException('Customer phone already exists');

    if (dto.nationalId) {
      const nationalConflict = await this.prisma.customer.findFirst({
        where: { nationalId: dto.nationalId },
        select: { id: true },
      });
      if (nationalConflict) throw new BadRequestException('Customer nationalId already exists');
    }

    return this.prisma.customer.create({
      data: { name: dto.name, phoneE164, nationalId: dto.nationalId ?? undefined },
      select: { id: true, name: true, phoneE164: true, nationalId: true, createdAt: true, updatedAt: true },
    });
  }

  async list(input: { page: number; limit: number }) {
    const page = Math.max(1, input.page);
    const limit = Math.min(100, Math.max(1, input.limit));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, name: true, phoneE164: true, nationalId: true, createdAt: true, updatedAt: true },
      }),
    ]);

    return { items, page, limit, total };
  }

  async getById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { id: true, name: true, phoneE164: true, nationalId: true, createdAt: true, updatedAt: true },
    });

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Customer not found');

    const phoneE164 = dto.phone ? normalizePhoneE164(dto.phone) : undefined;

    if (phoneE164) {
      const conflict = await this.prisma.customer.findFirst({
        where: { AND: [{ id: { not: id } }, { phoneE164 }] },
        select: { id: true },
      });
      if (conflict) throw new BadRequestException('Customer phone already exists');
    }

    if (dto.nationalId) {
      const conflict = await this.prisma.customer.findFirst({
        where: { AND: [{ id: { not: id } }, { nationalId: dto.nationalId }] },
        select: { id: true },
      });
      if (conflict) throw new BadRequestException('Customer nationalId already exists');
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        name: dto.name,
        phoneE164,
        nationalId: dto.nationalId ?? undefined,
      },
      select: { id: true, name: true, phoneE164: true, nationalId: true, createdAt: true, updatedAt: true },
    });
  }
}
