export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}
