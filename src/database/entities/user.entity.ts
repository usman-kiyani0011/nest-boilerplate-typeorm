import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '@shared/constants';

@Entity('users')
export class User extends BaseEntity {
  @Index('user-username-idx')
  @Column('varchar', { unique: true, length: 20 })
  username: string;

  @Column('varchar')
  password: string;

  @Index('user-name-idx')
  @Column('varchar')
  name: string;

  @Column({ type: 'json', nullable: true }) // ip, deviceId, city, country, network
  metadata?: Record<string, any>;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'tinyint', default: 1, unsigned: true }) // 1 - active | 2 - inactive
  status?: number;
}
