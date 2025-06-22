import { User } from '@modules/user/entities/User';

export const createMockUsers = (count: number): User[] =>
  Array.from({ length: count }).map(
    (_, i) =>
      new User({
        name: `User ${i + 1}`,
        email: `user${i + 1}@email.com`,
        password: 'hashed_password',
        role: i % 2 === 0 ? 'user' : 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
  );
