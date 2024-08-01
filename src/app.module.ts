import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ExceptionsFilter } from './filters';
import { AuthGuard } from './guards/auth.guard';
import { modules } from './modules';
import { SeedModule } from './seed/seed.module';
@Module({
  imports: [
    DatabaseModule,
    SeedModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 50, // 50 request in 10 seconds
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ...modules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
  ],
})
export class AppModule {}
