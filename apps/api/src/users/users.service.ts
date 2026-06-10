import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PublicUser, User, toPublicUser } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): PublicUser {
    if (this.findByEmail(data.email)) {
      throw new ConflictException('Email already in use');
    }
    const user: User = { id: randomUUID(), ...data };
    this.users.push(user);
    return toPublicUser(user);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
