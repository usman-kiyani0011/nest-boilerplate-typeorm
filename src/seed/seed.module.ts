import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers:[SeedController],
  providers: [SeedService],
})
export class SeedModule {}
