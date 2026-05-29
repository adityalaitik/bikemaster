// Core Types for RAMP WMS

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'garage_manager'
  | 'service_advisor'
  | 'technician'
  | 'cashier'
  | 'viewer';

export interface User {
  id: string;
  organizationId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Garage {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address?: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  gstin?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserGarageAssignment {
  id: string;
  userId: string;
  garageId: string;
  isPrimary: boolean;
  createdAt: Date;
}
