import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { RentalsModule } from './modules/rentals/rentals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // 🔥 Redis Cache (GLOBAL)
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      ttl: 60, // default cache time (seconds)
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    StocksModule,
    RentalsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
