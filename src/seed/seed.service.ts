import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@shared/constants';
import { successResponse } from '@shared/functions';
import * as bcrypt from 'bcrypt';
import { SystemUserRepository } from 'src/database/repositories/system-user.repository';

@Injectable()
export class SeedService {
  constructor(
    private readonly systemUserRepository: SystemUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async systemAdminSeed() {
    try {
      const username = this.configService.getOrThrow<string>('ADMIN_USERNAME');
      const password = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.systemUserRepository.create({
        username,
        password: hashedPassword,
        name: 'System Admin',
        role: UserRole.ADMIN,
      });
      await this.systemUserRepository.save(user);
      return successResponse(HttpStatus.OK, 'Admin created successfully');
    } catch (error) {
      throw error;
    }
  }
}
