import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@shared/constants';
/**
 * @description Auth is used for JWT Authentication
 */
export const Auth = (...roles: UserRole[]) => SetMetadata('role', roles);
