import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as express from 'express';
import { join, basename } from 'path';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(new SuccessResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    // --------------------
    // CORS Configuration
    // --------------------
    const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (corsOrigins.length === 0) return callback(null, false);
        if (corsOrigins.includes(origin)) return callback(null, true);

        logger.warn(`CORS denied for origin: ${origin}`);
        return callback(null, false);
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-HTTP-Method-Override'
      ],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    // --------------------
    // JSON / URL-encoded parsing
    // --------------------
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    // --------------------
    // Static files for /uploads
    // --------------------
    app.use(
      '/uploads',
      express.static(join(__dirname, '..', 'uploads'), {
        setHeaders: (res, filePath) => {
          const fileName = basename(filePath);
          res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self' data:; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          );
          res.setHeader('Referrer-Policy', 'no-referrer');
          res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-XSS-Protection', '1; mode=block');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
      }),
    );

    // --------------------
    // Start server
    // --------------------
    const port = process.env.PORT ?? 6000;
    await app.listen(port);
    logger.log(`Server running on port ${port}`);
  } catch (err) {
    logger.error('Bootstrap error', err as any);
    process.exit(1);
  }
}

bootstrap();
