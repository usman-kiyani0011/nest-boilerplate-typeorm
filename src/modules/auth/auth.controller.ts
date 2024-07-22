import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginReqDto, SignUpReqDto } from './auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  // @ApiCreatedResponse({ type: SignUpResDto })
  async signup(@Body() payload: SignUpReqDto) {
    return await this.authService.signup(payload);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: LoginResDto })
  async login(@Body() payload: LoginReqDto) {
    return await this.authService.login(payload);
  }

}
