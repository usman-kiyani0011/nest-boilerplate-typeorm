import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 50, // 50 request in 10 seconds
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
