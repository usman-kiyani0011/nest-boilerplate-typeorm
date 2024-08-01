import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SystemUserRepository } from 'src/database/repositories/system-user.repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@shared/constants';
import { JwtService } from '@nestjs/jwt';
import { successResponse } from '@shared/functions';
import { IUser } from 'src/shared/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly systemUserRepository: SystemUserRepository,
    private readonly jwtService: JwtService,
    private config: ConfigService,
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
    await this.systemUserRepository.save(user);
    return successResponse(HttpStatus.CREATED, 'User added successfully');
  }

  async login(payload: any) {
    const { username, password } = payload;
    const user = await this.systemUserRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return successResponse(HttpStatus.OK, 'Login successfully', {
      accessToken,
      refreshToken,
      user,
    });
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: await this.config.get('JWT_SECRET'),
      });
      if (!decoded || !decoded?.sub || !decoded?.isAccessToken)
        throw new UnauthorizedException('Invalid Token');

      const user = await this.systemUserRepository.findOne({
        where: { username: decoded?.username },
      });

      delete user.password;

      return user;
    } catch (error) {
      console.log('errpr', error);

      throw error;
    }
  }

  private generateAccessToken(user: IUser) {
    return this.jwtService.sign({
      isAccessToken: true,
      username: user?.username,
      role: user?.role,
      sub: user?.id,
    });
  }
  private generateRefreshToken(user: IUser) {
    return this.jwtService.sign(
      {
        isRefreshToken: true,
        username: user?.username,
        role: user?.role,
        sub: user?.id,
      },
      {
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
  }
}
