import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

function createFakePrisma(): PrismaService {
  const rows: User[] = [];
  return {
    user: {
      create: jest.fn(({ data }: { data: Omit<User, 'id'> }) => {
        if (rows.some((u) => u.email === data.email)) {
          return Promise.reject(
            new Prisma.PrismaClientKnownRequestError(
              'Unique constraint failed',
              { code: 'P2002', clientVersion: 'test' },
            ),
          );
        }
        const row: User = { id: randomUUID(), ...data };
        rows.push(row);
        return Promise.resolve(row);
      }),
      findUnique: jest.fn(({ where }: { where: Partial<User> }) =>
        Promise.resolve(
          rows.find((u) =>
            where.email ? u.email === where.email : u.id === where.id,
          ) ?? null,
        ),
      ),
    },
  } as unknown as PrismaService;
}

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(createFakePrisma());
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
      const user = await usersService.findByEmail('ada@test.com');
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
