import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface GarageRef {
  garageId: string;
  garageCode: string;
  garageName: string;
}

export const DEMO_USERS: Array<{
  id: string; username: string; password: string;
  role: string; name: string; garages: GarageRef[];
}> = [
  // ── Super admin — access to all branches ────────────────────────────────
  {
    id: 'u1', username: 'admin', password: 'admin123',
    role: 'super_admin', name: 'Aditya Pradhan',
    garages: [
      { garageId: '11111111-1111-1111-1111-111111111111', garageCode: 'BBR-001', garageName: 'Bhubaneswar Branch' },
      { garageId: '33333333-3333-3333-3333-000000000001', garageCode: 'PTI-003', garageName: 'Patia Branch' },
    ],
  },

  // ── Bhubaneswar Branch ───────────────────────────────────────────────────
  { id: 'u2', username: 'manager', password: 'manager123', role: 'garage_manager',  name: 'Subhashis Sen', garages: [{ garageId: '11111111-1111-1111-1111-111111111111', garageCode: 'BBR-001', garageName: 'Bhubaneswar Branch' }] },
  { id: 'u3', username: 'advisor', password: 'advisor123', role: 'service_advisor', name: 'Priya Sharma',  garages: [{ garageId: '11111111-1111-1111-1111-111111111111', garageCode: 'BBR-001', garageName: 'Bhubaneswar Branch' }] },
  { id: 'u4', username: 'tech',    password: 'tech123',    role: 'technician',      name: 'Ravi Kumar',    garages: [{ garageId: '11111111-1111-1111-1111-111111111111', garageCode: 'BBR-001', garageName: 'Bhubaneswar Branch' }] },
  { id: 'u5', username: 'cashier', password: 'cashier123', role: 'cashier',         name: 'Anita Das',     garages: [{ garageId: '11111111-1111-1111-1111-111111111111', garageCode: 'BBR-001', garageName: 'Bhubaneswar Branch' }] },

  // ── Patia Branch ─────────────────────────────────────────────────────────
  { id: 'u6', username: 'manager.ptia', password: 'manager123', role: 'garage_manager',  name: 'Deepak Mohanty', garages: [{ garageId: '33333333-3333-3333-3333-000000000001', garageCode: 'PTI-003', garageName: 'Patia Branch' }] },
  { id: 'u7', username: 'advisor.ptia', password: 'advisor123', role: 'service_advisor', name: 'Sneha Pattnaik',  garages: [{ garageId: '33333333-3333-3333-3333-000000000001', garageCode: 'PTI-003', garageName: 'Patia Branch' }] },
  { id: 'u8', username: 'tech.ptia',    password: 'tech123',    role: 'technician',      name: 'Bikash Nayak',   garages: [{ garageId: '33333333-3333-3333-3333-000000000001', garageCode: 'PTI-003', garageName: 'Patia Branch' }] },
  { id: 'u9', username: 'cashier.ptia', password: 'cashier123', role: 'cashier',         name: 'Kavita Rath',    garages: [{ garageId: '33333333-3333-3333-3333-000000000001', garageCode: 'PTI-003', garageName: 'Patia Branch' }] },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    if (user.garages.length === 1) {
      // Single branch — issue JWT immediately
      const g = user.garages[0];
      return {
        success: true,
        requiresBranchSelection: false,
        access_token: this.jwtService.sign({
          sub: user.id, username: user.username, role: user.role,
          name: user.name, garageId: g.garageId, garageCode: g.garageCode,
        }),
        user: {
          id: user.id, name: user.name, username: user.username, role: user.role,
          garageId: g.garageId, garageCode: g.garageCode, garageName: g.garageName,
        },
      };
    }

    // Multi-branch user — return choices without issuing a JWT yet
    return {
      success: true,
      requiresBranchSelection: true,
      userId: user.id,
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
      garages: user.garages,
    };
  }

  async selectBranch(userId: string, garageId: string) {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) throw new UnauthorizedException('User not found');

    const garage = user.garages.find(g => g.garageId === garageId);
    if (!garage) throw new UnauthorizedException('Branch not assigned to this user');

    return {
      success: true,
      access_token: this.jwtService.sign({
        sub: user.id, username: user.username, role: user.role,
        name: user.name, garageId: garage.garageId, garageCode: garage.garageCode,
      }),
      user: {
        id: user.id, name: user.name, username: user.username, role: user.role,
        garageId: garage.garageId, garageCode: garage.garageCode, garageName: garage.garageName,
      },
    };
  }
}
