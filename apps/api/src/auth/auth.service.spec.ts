import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService, DEMO_USERS } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtSign: jest.Mock;

  beforeEach(async () => {
    jwtSign = jest.fn().mockReturnValue('mock-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jwtSign } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login — valid credentials', () => {
    it('returns success, access_token, and user info', async () => {
      const result = await service.login('admin', 'admin123');

      expect(result.success).toBe(true);
      expect(result.access_token).toBe('mock-token');
      expect(result.user).toMatchObject({
        id: 'u1',
        username: 'admin',
        role: 'super_admin',
        name: 'Aditya Pradhan',
        garageId: 'G001',
        garageCode: 'BBR-001',
      });
    });

    it('calls jwtService.sign with the correct payload', async () => {
      await service.login('advisor', 'advisor123');

      expect(jwtSign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'u3',
          username: 'advisor',
          role: 'service_advisor',
          name: 'Priya Sharma',
          garageId: 'G001',
          garageCode: 'BBR-001',
        }),
      );
    });
  });

  describe('login — invalid credentials', () => {
    it('throws UnauthorizedException for wrong password', async () => {
      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for unknown username', async () => {
      await expect(service.login('ghost', 'ghost123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for empty credentials', async () => {
      await expect(service.login('', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login — each demo user', () => {
    it.each(DEMO_USERS)(
      'authenticates $username with correct password',
      async (user) => {
        const result = await service.login(user.username, user.password);

        expect(result.success).toBe(true);
        expect(result.access_token).toBe('mock-token');
        expect(result.user.username).toBe(user.username);
        expect(result.user.role).toBe(user.role);
        expect(result.user.id).toBe(user.id);
      },
    );

    it.each(DEMO_USERS)(
      'rejects $username with wrong password',
      async (user) => {
        await expect(
          service.login(user.username, 'bad_password'),
        ).rejects.toThrow(UnauthorizedException);
      },
    );
  });
});
