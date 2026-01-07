import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import type { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    const userCount = await this.prisma.user.count();
    if (userCount > 0) {
      throw new ForbiddenException('Public registration is disabled');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        username: input.username,
        passwordHash,
        role: 'admin',
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    const accessToken = await this.signAccessToken(user.id, user.role);

    return {
      accessToken,
      user,
    };
  }

  async login(input: { identifier: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input.identifier }, { username: input.identifier }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.signAccessToken(user.id, user.role);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async createRefreshSession(userId: string, refreshTokenPlain: string) {
    const refreshTokenHash = await bcrypt.hash(refreshTokenPlain, 10);

    const ttlDays = Number(this.configService.get<string>('REFRESH_TOKEN_TTL_DAYS') || 30);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    return this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
      select: { id: true, expiresAt: true },
    });
  }

  async refresh(input: { refreshToken: string }) {
    const sessions = await this.prisma.session.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        userId: true,
        refreshTokenHash: true,
        expiresAt: true,
      },
    });

    // We don't store raw tokens, so we need to compare against active sessions.
    // This is O(n) without a token identifier; acceptable initially, but we can optimize
    // by embedding a sessionId in the refresh token later.
    let matched: { id: string; userId: string } | null = null;

    for (const s of sessions) {
      const ok = await bcrypt.compare(input.refreshToken, s.refreshTokenHash);
      if (ok) {
        matched = { id: s.id, userId: s.userId };
        break;
      }
    }

    if (!matched) throw new UnauthorizedException('Invalid refresh token');

    // Rotate: revoke old session and create new
    await this.prisma.session.update({
      where: { id: matched.id },
      data: { revokedAt: new Date() },
      select: { id: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: matched.userId },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user) throw new UnauthorizedException('Invalid refresh token');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const accessToken = await this.signAccessToken(user.id, user.role);

    return {
      accessToken,
      user,
    };
  }

  async logout(input: { refreshToken?: string; userId?: string }) {
    // If userId is known (Bearer), revoke all active sessions.
    if (input.userId) {
      await this.prisma.session.updateMany({
        where: { userId: input.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return { success: true };
    }

    // Otherwise, revoke the matching refresh session.
    if (input.refreshToken) {
      const sessions = await this.prisma.session.findMany({
        where: { revokedAt: null },
        select: { id: true, refreshTokenHash: true },
      });

      for (const s of sessions) {
        const ok = await bcrypt.compare(input.refreshToken, s.refreshTokenHash);
        if (ok) {
          await this.prisma.session.update({
            where: { id: s.id },
            data: { revokedAt: new Date() },
          });
          break;
        }
      }

      return { success: true };
    }

    return { success: true };
  }

  private async signAccessToken(userId: string, role: UserRole) {
    const expiresIn = '1h';
    return this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      },
    );
  }
}
