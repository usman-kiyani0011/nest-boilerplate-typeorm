import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { SystemUser } from '../entities/system-user.entity';

@Injectable()
export class SystemUserRepository extends BaseRepository<SystemUser> {
  constructor(
    @InjectRepository(SystemUser)
    repository: Repository<SystemUser>,
  ) {
    super(repository);
  }
}
