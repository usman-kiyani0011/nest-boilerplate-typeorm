import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SystemUserRepository } from 'src/database/repositories/system-user.repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@shared/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly systemUserRepository: SystemUserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signup(payload: any) {
    const { username, password, name } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.systemUserRepository.create({
      username,
      password: hashedPassword,
      name,
      role: UserRole.USER,
    });
    return this.systemUserRepository.save(user);
  }

  async login(payload: any) {
    const { username, password } = payload;
    const user = await this.systemUserRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const newPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.sign(newPayload);

    return { accessToken };
  }

  async verifyToken(token: any) {
    // Your token verification logic here
    return { userId: 1 }; // Dummy response
  }
}
