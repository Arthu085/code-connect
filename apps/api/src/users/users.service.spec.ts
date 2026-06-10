import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('creates a user and returns public data without passwordHash', () => {
    const result = service.create({
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    });
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Ada');
    expect(result.email).toBe('ada@test.com');
    expect(Object.keys(result)).not.toContain('passwordHash');
  });

  it('throws ConflictException when email is already taken', () => {
    service.create({
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    });
    expect(() =>
      service.create({
        name: 'Ada2',
        email: 'ada@test.com',
        passwordHash: 'hash2',
      }),
    ).toThrow(ConflictException);
  });

  it('finds user by email', () => {
    service.create({
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    });
    const found = service.findByEmail('ada@test.com');
    expect(found).toBeDefined();
    expect(found!.email).toBe('ada@test.com');
  });

  it('returns undefined for unknown email', () => {
    expect(service.findByEmail('unknown@test.com')).toBeUndefined();
  });

  it('finds user by id', () => {
    const user = service.create({
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    });
    const found = service.findById(user.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(user.id);
  });

  it('returns undefined for unknown id', () => {
    expect(service.findById('non-existent-id')).toBeUndefined();
  });
});
