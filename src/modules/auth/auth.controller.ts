import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginReqDto, SignUpReqDto } from './auth.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { Auth } from '@shared/decorators';
import { UserRole } from '@shared/constants';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user-signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() payload: SignUpReqDto): Promise<IResponse> {
    return await this.authService.signup(payload);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginReqDto): Promise<IResponse> {
    return await this.authService.login(payload);
  }

  @ApiBearerAuth()
  @Get('login')
  @Auth(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async test(): Promise<any> {
    return { hello: 'heh' };
  }
}
