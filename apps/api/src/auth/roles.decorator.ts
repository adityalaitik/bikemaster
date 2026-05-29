import { SetMetadata } from '@nestjs/common';

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'garage_manager'
  | 'service_advisor'
  | 'technician'
  | 'cashier'
  | 'viewer';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
