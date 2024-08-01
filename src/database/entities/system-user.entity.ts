import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '@shared/constants';

@Entity('systemUsers')
export class SystemUser extends BaseEntity {
  @Column('varchar', { unique: true, length: 20 })
  username: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'number', default: 1, unsigned: true }) // 1 - active | 2 - inactive
  status?: number;
}
