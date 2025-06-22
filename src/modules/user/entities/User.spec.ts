import { Role } from '@providers/auth/roles';
import { UserDTO } from '../dto/UserDTO';
import { User } from './User';

describe('User Entity', () => {
  describe('Constructor', () => {
    it('should create user with all required properties', () => {
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: null,
        lastLoginAt: null,
      };

      const user = new User(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe(userData.role);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeNull();
      expect(user.lastLoginAt).toBeNull();
    });

    it('should create user with custom id', () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashed_password',
        role: Role.User,
      };
      const customId = 'custom-user-id-123';

      const user = new User(userData, customId);

      expect(user.id).toBe(customId);
    });

    it('should create user with default role when not provided', () => {
      const userData = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'hashed_password',
      };

      const user = new User(userData);

      expect(user.role).toBe('user');
    });

    it('should create user with provided optional dates', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const lastLoginAt = new Date('2023-01-03');

      const userData = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'hashed_password',
        createdAt,
        updatedAt,
        lastLoginAt,
        role: Role.User,
      };

      const user = new User(userData);

      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
      expect(user.lastLoginAt).toBe(lastLoginAt);
    });

    it('should set default createdAt when not provided', () => {
      const beforeCreation = new Date();

      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: Role.User,
      });

      const afterCreation = new Date();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('Getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.Admin,
      });
    });

    it('should return correct property values', () => {
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('hashed_password');
      expect(user.role).toBe(Role.Admin);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeNull();
      expect(user.lastLoginAt).toBeNull();
    });
  });

  describe('Setters', () => {
    let user: User;
    let originalUpdatedAt: Date | null;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      });
      originalUpdatedAt = user.updatedAt;
    });

    it('should update name and call touch()', () => {
      const newName = 'Jane Doe';

      user.name = newName;

      expect(user.name).toBe(newName);
      expect(user.updatedAt).not.toBe(originalUpdatedAt);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update email and call touch()', () => {
      const newEmail = 'newemail@example.com';

      user.email = newEmail;

      expect(user.email).toBe(newEmail);
      expect(user.updatedAt).not.toBe(originalUpdatedAt);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update password and call touch()', () => {
      const newPassword = 'new_hashed_password';

      user.password = newPassword;

      expect(user.password).toBe(newPassword);
      expect(user.updatedAt).not.toBe(originalUpdatedAt);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update role and call touch()', () => {
      const newRole = Role.Admin;

      user.role = newRole;

      expect(user.role).toBe(newRole);
      expect(user.updatedAt).not.toBe(originalUpdatedAt);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update lastLoginAt and call touch()', () => {
      const loginDate = new Date();

      user.lastLoginAt = loginDate;

      expect(user.lastLoginAt).toBe(loginDate);
      expect(user.updatedAt).not.toBe(originalUpdatedAt);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow setting lastLoginAt to null', () => {
      user.lastLoginAt = new Date();
      expect(user.lastLoginAt).toBeInstanceOf(Date);

      user.lastLoginAt = null;
      expect(user.lastLoginAt).toBeNull();
    });
  });

  describe('touch() method', () => {
    it('should update updatedAt timestamp when called directly', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: Role.User,
      });

      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.touch();

        expect(user.updatedAt).not.toBe(originalUpdatedAt);
        expect(user.updatedAt).toBeInstanceOf(Date);
      }, 1);
    });

    it('should be called automatically when properties are updated', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: Role.User,
      });

      const touchSpy = jest.spyOn(user, 'touch');

      user.name = 'New Name';

      expect(touchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Entity inheritance', () => {
    it('should be able to compare users by id', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: Role.User,
      };

      const user1 = new User(userData, 'same-id');
      const user2 = new User(userData, 'same-id');
      const user3 = new User(userData, 'different-id');

      expect(user1.equals(user2)).toBe(true);
      expect(user1.equals(user3)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      const user = new User({
        name: '',
        email: '',
        password: '',
        role: '',
      });

      expect(user.name).toBe('');
      expect(user.email).toBe('');
      expect(user.password).toBe('');
      expect(user.role).toBe('');
    });

    it('should handle multiple property updates', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: Role.User,
      });

      const initialUpdatedAt = user.updatedAt;

      user.name = 'Jane Doe';
      const firstUpdate = user.updatedAt;

      user.email = 'jane@example.com';
      const secondUpdate = user.updatedAt;

      expect(firstUpdate).not.toBe(initialUpdatedAt);
      expect(secondUpdate).not.toBe(firstUpdate);
    });
  });
});
