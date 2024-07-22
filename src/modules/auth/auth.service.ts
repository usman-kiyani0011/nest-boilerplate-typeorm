import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@shared/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signup(payload: any) {
    const { username, password, name } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      name,
      role: UserRole.USER,
    });
    return this.userRepository.save(user);
  }

  async login(payload: any) {
    const { username, password } = payload;
    const user = await this.userRepository.findOne({ where: { username } });

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
