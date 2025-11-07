import { MockAuthAdapter } from '../../../adapters/auth/MockAuthAdapter';

describe('MockAuthAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MockAuthAdapter();
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is set', async () => {
      const user = await adapter.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return the mock user when set', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      const user = await adapter.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('setMockUser', () => {
    it('should set the mock user', async () => {
      const mockUser = { id: 'test-123', username: 'testuser', isAdmin: false };
      adapter.setMockUser(mockUser);

      const user = await adapter.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('should update the mock user', async () => {
      const mockUser1 = MockAuthAdapter.createMockUser();
      const mockUser2 = MockAuthAdapter.createMockAdminUser();

      adapter.setMockUser(mockUser1);
      expect(await adapter.getCurrentUser()).toEqual(mockUser1);

      adapter.setMockUser(mockUser2);
      expect(await adapter.getCurrentUser()).toEqual(mockUser2);
    });
  });

  describe('signOut', () => {
    it('should clear the mock user', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      await adapter.signOut();

      const user = await adapter.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should set signOutCalled flag', async () => {
      await adapter.signOut();
      expect(adapter.signOutCalled).toBe(true);
    });
  });

  describe('refreshTokens', () => {
    it('should return the current user', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);

      const result = await adapter.refreshTokens();
      expect(result).toEqual(mockUser);
    });

    it('should set refreshCalled flag', async () => {
      await adapter.refreshTokens();
      expect(adapter.refreshCalled).toBe(true);
    });
  });

  describe('getAuthStatus', () => {
    it('should return unauthenticated when no user is set', async () => {
      const status = await adapter.getAuthStatus();
      expect(status).toBe('unauthenticated');
    });

    it('should return authenticated when user is set', async () => {
      adapter.setMockUser(MockAuthAdapter.createMockUser());

      const status = await adapter.getAuthStatus();
      expect(status).toBe('authenticated');
    });
  });

  describe('clearCache', () => {
    it('should not throw an error', () => {
      expect(() => adapter.clearCache()).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      adapter.setMockUser(mockUser);
      await adapter.signOut();
      await adapter.refreshTokens();

      adapter.reset();

      expect(await adapter.getCurrentUser()).toBeNull();
      expect(adapter.signOutCalled).toBe(false);
      expect(adapter.refreshCalled).toBe(false);
    });
  });

  describe('createMockAdminUser', () => {
    it('should create an admin user with default values', () => {
      const user = MockAuthAdapter.createMockAdminUser();

      expect(user.id).toBe('mock-admin-123');
      expect(user.username).toBe('mockadmin');
      expect(user.email).toBe('admin@example.com');
      expect(user.isAdmin).toBe(true);
      expect(user.tokens).toBeDefined();
    });

    it('should allow overriding default values', () => {
      const user = MockAuthAdapter.createMockAdminUser({
        username: 'customadmin',
        email: 'custom@example.com'
      });

      expect(user.username).toBe('customadmin');
      expect(user.email).toBe('custom@example.com');
      expect(user.isAdmin).toBe(true);
    });
  });

  describe('createMockUser', () => {
    it('should create a regular user with default values', () => {
      const user = MockAuthAdapter.createMockUser();

      expect(user.id).toBe('mock-user-456');
      expect(user.username).toBe('mockuser');
      expect(user.email).toBe('user@example.com');
      expect(user.isAdmin).toBe(false);
      expect(user.tokens).toBeDefined();
    });

    it('should allow overriding default values', () => {
      const user = MockAuthAdapter.createMockUser({
        username: 'customuser',
        isAdmin: true
      });

      expect(user.username).toBe('customuser');
      expect(user.isAdmin).toBe(true);
    });
  });
});
