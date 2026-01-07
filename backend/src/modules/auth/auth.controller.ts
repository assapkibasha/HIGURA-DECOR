import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);

    const refreshToken = this.generateRefreshToken();
    await this.authService.createRefreshSession(result.user.id, refreshToken);

    this.setRefreshCookie(res, refreshToken);

    // IMPORTANT: login/register response must be exactly {accessToken, user}
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    const refreshToken = this.generateRefreshToken();
    await this.authService.createRefreshSession(result.user.id, refreshToken);

    this.setRefreshCookie(res, refreshToken);

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieToken = (req as any).cookies?.refreshToken as string | undefined;
    const refreshToken = dto.refreshToken || cookieToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const result = await this.authService.refresh({ refreshToken });

    const newRefreshToken = this.generateRefreshToken();
    await this.authService.createRefreshSession(result.user.id, newRefreshToken);
    this.setRefreshCookie(res, newRefreshToken);

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.id as string | undefined;
    await this.authService.logout({ userId });

    res.clearCookie('refreshToken', { path: '/' });
    return { success: true };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    return req.user;
  }

  private setRefreshCookie(res: Response, token: string) {
    const secure = (process.env.COOKIE_SECURE || 'true') === 'true';
    const sameSite = (process.env.COOKIE_SAMESITE || 'none') as any;

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  private generateRefreshToken(): string {
    // simple token for now; can replace with crypto.randomBytes later
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }
}
