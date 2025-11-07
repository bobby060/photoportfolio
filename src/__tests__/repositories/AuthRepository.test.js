import { AuthRepository } from '../../repositories/AuthRepository';
import { MockAuthAdapter } from '../../adapters/auth/MockAuthAdapter';

describe('AuthRepository', () => {
  let adapter;
  let repository;

  beforeEach(() => {
    adapter = new MockAuthAdapter();
    repository = new AuthRepository(adapter);
  });

  describe('getUser', () => {
    it('should return null when not authenticated', async () => {
      const user = await repository.getUser();
      expect(user).toBeNull();
    });

    it('should return user when authenticated', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      const user = await repository.getUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not authenticated', async () => {
      const result = await repository.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true when authenticated', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());

      const result = await repository.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return false when not authenticated', async () => {
      const result = await repository.isAdmin();
      expect(result).toBe(false);
    });

    it('should return false for regular user', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());

      const result = await repository.isAdmin();
      expect(result).toBe(false);
    });

    it('should return true for admin user', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockAdminUser());

      const result = await repository.isAdmin();
      expect(result).toBe(true);
    });
  });

  describe('getUserInfo', () => {
    it('should return null when not authenticated', async () => {
      const info = await repository.getUserInfo();
      expect(info).toBeNull();
    });

    it('should return user info without tokens', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      const info = await repository.getUserInfo();

      expect(info).toEqual({
        username: mockUser.username,
        email: mockUser.email,
        isAdmin: mockUser.isAdmin
      });
      expect(info.tokens).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should call adapter signOut', async () => {
      await repository.logout();
      expect(adapter.signOutCalled).toBe(true);
    });

    it('should clear user after logout', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());
      await repository.logout();

      const user = await repository.getUser();
      expect(user).toBeNull();
    });
  });

  describe('refreshSession', () => {
    it('should call adapter refreshTokens', async () => {
      await repository.refreshSession();
      expect(adapter.refreshCalled).toBe(true);
    });

    it('should return updated user', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      const result = await repository.refreshSession();
      expect(result).toEqual(mockUser);
    });
  });

  describe('requireAuth', () => {
    it('should throw when not authenticated', async () => {
      await expect(repository.requireAuth()).rejects.toThrow('Authentication required');
    });

    it('should not throw when authenticated', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());

      await expect(repository.requireAuth()).resolves.not.toThrow();
    });
  });

  describe('requireAdmin', () => {
    it('should throw when not admin', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());

      await expect(repository.requireAdmin()).rejects.toThrow('Admin privileges required');
    });

    it('should not throw when user is admin', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockAdminUser());

      await expect(repository.requireAdmin()).resolves.not.toThrow();
    });

    it('should throw when not authenticated', async () => {
      await expect(repository.requireAdmin()).rejects.toThrow('Admin privileges required');
    });
  });

  describe('clearCache', () => {
    it('should call adapter clearCache', () => {
      const spy = jest.spyOn(adapter, 'clearCache');
      repository.clearCache();
      expect(spy).toHaveBeenCalled();
    });
  });
});
