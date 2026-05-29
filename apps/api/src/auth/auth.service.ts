import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const DEMO_USERS = [
  {
    id: 'u1',
    username: 'manager',
    password: 'manager123',
    role: 'garage_manager',
    name: 'Subhashis Sen',
    garageId: 'G001',
    garageCode: 'BBR-001',
  },
  {
    id: 'u2',
    username: 'advisor',
    password: 'advisor123',
    role: 'service_advisor',
    name: 'Priya Sharma',
    garageId: 'G001',
    garageCode: 'BBR-001',
  },
  {
    id: 'u3',
    username: 'tech',
    password: 'tech123',
    role: 'technician',
    name: 'Ravi Kumar',
    garageId: 'G001',
    garageCode: 'BBR-001',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = DEMO_USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      garageId: user.garageId,
      garageCode: user.garageCode,
    };

    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        garageId: user.garageId,
        garageCode: user.garageCode,
      },
    };
  }
}
