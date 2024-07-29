import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
// import { UserSeederService } from './user-seeder.service';
// import { User } from '../users/user.entity';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [],
  exports: [],
})
export class SeedersModule {}
