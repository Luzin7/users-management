import { RefreshTokenDTO } from '../dto/RefreshTokenDTO';
import { RefreshToken } from './RefreshToken';

describe('RefreshToken', () => {
  const validProps: RefreshTokenDTO = {
    token: 'valid-refresh-token-jwt',
    expiresIn: new Date(Date.now() + 86400000),
    userId: 'user-uuid-123',
  };

  it('should create refresh token with provided props', () => {
    const createdAt = new Date();
    const refreshToken = new RefreshToken({
      ...validProps,
      createdAt,
    });

    expect(refreshToken.token).toBe(validProps.token);
    expect(refreshToken.expiresIn).toBe(validProps.expiresIn);
    expect(refreshToken.userId).toBe(validProps.userId);
    expect(refreshToken.createdAt).toBe(createdAt);
  });

  it('should create refresh token with auto-generated createdAt when not provided', () => {
    const beforeCreation = new Date();
    const refreshToken = new RefreshToken(validProps);
    const afterCreation = new Date();

    expect(refreshToken.token).toBe(validProps.token);
    expect(refreshToken.expiresIn).toBe(validProps.expiresIn);
    expect(refreshToken.userId).toBe(validProps.userId);
    expect(refreshToken.createdAt).toBeInstanceOf(Date);
    expect(refreshToken.createdAt!).toBeInstanceOf(Date);
    expect(refreshToken.createdAt! >= beforeCreation).toBe(true);
    expect(refreshToken.createdAt! <= afterCreation).toBe(true);
  });

  it('should create refresh token with custom id', () => {
    const customId = 'custom-refresh-token-id';
    const refreshToken = new RefreshToken(validProps, customId);

    expect(refreshToken.id).toBe(customId);
    expect(refreshToken.token).toBe(validProps.token);
  });
});
