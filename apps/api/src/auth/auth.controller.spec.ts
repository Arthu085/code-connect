import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockToken = { access_token: 'mock-token' };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as AuthService;
    usersService = { findById: jest.fn() } as unknown as UsersService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('register delegates to AuthService and returns the token', async () => {
    const spy = jest
      .spyOn(authService, 'register')
      .mockResolvedValue(mockToken);
    const result = await controller.register({
      name: 'Ada',
      email: 'ada@test.com',
      password: 'secret123',
    });
    expect(spy).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@test.com',
      password: 'secret123',
    });
    expect(result).toEqual(mockToken);
  });

  it('login delegates to AuthService and returns the token', async () => {
    const spy = jest.spyOn(authService, 'login').mockResolvedValue(mockToken);
    const result = await controller.login({
      email: 'ada@test.com',
      password: 'secret123',
    });
    expect(spy).toHaveBeenCalledWith({
      email: 'ada@test.com',
      password: 'secret123',
    });
    expect(result).toEqual(mockToken);
  });

  it('profile returns user data without passwordHash', () => {
    const mockUser = {
      id: 'user-1',
      name: 'Ada',
      email: 'ada@test.com',
      passwordHash: 'hash',
    };
    const spy = jest.spyOn(usersService, 'findById').mockReturnValue(mockUser);

    const req = { user: { userId: 'user-1', email: 'ada@test.com' } };
    const result = controller.profile(req);

    expect(spy).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({
      id: 'user-1',
      name: 'Ada',
      email: 'ada@test.com',
    });
    expect(Object.keys(result)).not.toContain('passwordHash');
  });
});
