import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
    authService = new AuthService(
      usersService,
      new JwtService({ secret: 'test-secret' }),
    );
  });

  describe('register', () => {
    it('returns an access_token on successful registration', async () => {
      const result = await authService.register({
        name: 'Ada',
        email: 'ada@test.com',
        password: 'secret123',
      });
      expect(result.access_token).toBeDefined();
      expect(typeof result.access_token).toBe('string');
    });

    it('throws ConflictException when email is already taken', async () => {
      await authService.register({
        name: 'Ada',
        email: 'ada@test.com',
        password: 'secret123',
      });
      await expect(
        authService.register({
          name: 'Ada2',
          email: 'ada@test.com',
          password: 'secret456',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('stores password as bcrypt hash', async () => {
      await authService.register({
        name: 'Ada',
        email: 'ada@test.com',
        password: 'secret123',
      });
      const user = usersService.findByEmail('ada@test.com');
      expect(user).toBeDefined();
      const matches = await bcrypt.compare('secret123', user!.passwordHash);
      expect(matches).toBe(true);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register({
        name: 'Ada',
        email: 'ada@test.com',
        password: 'secret123',
      });
    });

    it('returns an access_token with correct credentials', async () => {
      const result = await authService.login({
        email: 'ada@test.com',
        password: 'secret123',
      });
      expect(result.access_token).toBeDefined();
    });

    it('throws UnauthorizedException for unknown email', async () => {
      await expect(
        authService.login({ email: 'unknown@test.com', password: 'secret123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      await expect(
        authService.login({
          email: 'ada@test.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
