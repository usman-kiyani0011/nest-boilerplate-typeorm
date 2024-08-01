import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { IResponse } from 'src/shared/interfaces/response.interface';
@ApiTags('Seeds')
@Controller('/seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post('/system-admin')
  async systemAdminSeed(): Promise<IResponse> {
    return await this.seedService.systemAdminSeed();
  }
}
