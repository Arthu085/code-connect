import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('creates a user and returns public data without passwordHash', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'uuid-1',
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create({
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Ada');
    expect(result.email).toBe('ada@test.com');
    expect(Object.keys(result)).not.toContain('passwordHash');
  });

  it('throws ConflictException when email is already taken', async () => {
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.create({
        name: 'Ada2',
        email: 'ada@test.com',
        passwordHash: 'hash2',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('finds user by email', async () => {
    const user = {
      id: 'uuid-1',
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.user.findUnique.mockResolvedValue(user);

    const found = await service.findByEmail('ada@test.com');
    expect(found).toBeDefined();
    expect(found!.email).toBe('ada@test.com');
  });

  it('returns null for unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await service.findByEmail('unknown@test.com')).toBeNull();
  });

  it('finds user by id', async () => {
    const user = {
      id: 'uuid-1',
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.user.findUnique.mockResolvedValue(user);

    const found = await service.findById(user.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(user.id);
  });

  it('returns null for unknown id', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await service.findById('non-existent-id')).toBeNull();
  });
});
