import { SharedModule } from 'src/shared/shared.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';

export const modules = [SharedModule, HealthCheckModule, AuthModule];
