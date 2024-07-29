import { Injectable } from '@nestjs/common';
import { UserRole } from '@shared/constants';
import * as bcrypt from 'bcrypt';
import { SystemUserRepository } from 'src/database/repositories/system-user.repository';

@Injectable()
export class UserSeederService {
  constructor(
    private readonly systemUserRepository: SystemUserRepository,
  ) {}

  async seed() {

      const user = await this.systemUserRepository.create({
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        name:'System Admin',
        role: UserRole.USER,
      });
      return this.systemUserRepository.save(user);
    }
}
