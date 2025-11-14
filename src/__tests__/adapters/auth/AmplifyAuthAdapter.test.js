import { AmplifyAuthAdapter } from '../../../adapters/auth/AmplifyAuthAdapter';
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';

// Mock AWS Amplify auth functions
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(),
  signOut: jest.fn()
}));

describe('AmplifyAuthAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new AmplifyAuthAdapter();
    jest.clearAllMocks();
  });

  const createMockTokens = (isAdmin = false) => ({
    accessToken: {
      payload: {
        'cognito:groups': isAdmin ? ['portfolio_admin'] : []
      },
      toString: () => 'mock-access-token'
    },
    idToken: {
      payload: {
        sub: 'user-123',
        'cognito:username': 'testuser',
        email: 'test@example.com'
      },
      toString: () => 'mock-id-token'
    }
  });

  describe('getCurrentUser', () => {
    it('should return user object when authenticated', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      const user = await adapter.getCurrentUser();

      expect(user).toEqual({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        isAdmin: false,
        tokens: {
          accessToken: 'mock-access-token',
          idToken: 'mock-id-token'
        }
      });
      expect(fetchAuthSession).toHaveBeenCalledTimes(1);
    });

    it('should identify admin users correctly', async () => {
      const mockTokens = createMockTokens(true);
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      const user = await adapter.getCurrentUser();

      expect(user.isAdmin).toBe(true);
    });

    it('should return null when no tokens available', async () => {
      fetchAuthSession.mockResolvedValue({ tokens: null });

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should return null when missing accessToken', async () => {
      fetchAuthSession.mockResolvedValue({
        tokens: { idToken: createMockTokens().idToken }
      });

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should return null when missing idToken', async () => {
      fetchAuthSession.mockResolvedValue({
        tokens: { accessToken: createMockTokens().accessToken }
      });

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      fetchAuthSession.mockRejectedValue(new Error('Auth error'));

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should use cached user within TTL', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // First call
      const user1 = await adapter.getCurrentUser();
      // Second call (should use cache)
      const user2 = await adapter.getCurrentUser();

      expect(user1).toEqual(user2);
      expect(fetchAuthSession).toHaveBeenCalledTimes(1);
    });

    it('should fetch fresh user after cache expires', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // Set very short TTL for testing
      adapter.CACHE_TTL = 10;

      // First call
      await adapter.getCurrentUser();

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 20));

      // Second call (should fetch fresh)
      await adapter.getCurrentUser();

      expect(fetchAuthSession).toHaveBeenCalledTimes(2);
    });

    it('should handle missing email gracefully', async () => {
      const mockTokens = createMockTokens();
      mockTokens.idToken.payload.email = undefined;
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      const user = await adapter.getCurrentUser();

      expect(user.email).toBe('');
    });
  });

  describe('signOut', () => {
    it('should call amplify signOut and clear cache', async () => {
      amplifySignOut.mockResolvedValue();

      // Set up cached user
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });
      await adapter.getCurrentUser();

      // Sign out
      await adapter.signOut();

      expect(amplifySignOut).toHaveBeenCalledTimes(1);
      expect(adapter._cachedUser).toBeNull();
      expect(adapter._cacheExpiry).toBeNull();
    });

    it('should throw error when sign out fails', async () => {
      amplifySignOut.mockRejectedValue(new Error('Sign out failed'));

      await expect(adapter.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('refreshTokens', () => {
    it('should clear cache and fetch fresh user', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // Initial call
      await adapter.getCurrentUser();
      expect(fetchAuthSession).toHaveBeenCalledTimes(1);

      // Refresh tokens
      const user = await adapter.refreshTokens();

      expect(fetchAuthSession).toHaveBeenCalledTimes(2);
      expect(user).toBeDefined();
    });

    it('should return null if refresh fails', async () => {
      fetchAuthSession.mockRejectedValue(new Error('Refresh failed'));

      const user = await adapter.refreshTokens();

      expect(user).toBeNull();
    });
  });

  describe('getAuthStatus', () => {
    it('should return "authenticated" when user is authenticated', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      const status = await adapter.getAuthStatus();

      expect(status).toBe('authenticated');
    });

    it('should return "unauthenticated" when no user', async () => {
      fetchAuthSession.mockResolvedValue({ tokens: null });

      const status = await adapter.getAuthStatus();

      expect(status).toBe('unauthenticated');
    });

    it('should return "unauthenticated" on error', async () => {
      fetchAuthSession.mockRejectedValue(new Error('Auth error'));

      const status = await adapter.getAuthStatus();

      expect(status).toBe('unauthenticated');
    });
  });

  describe('clearCache', () => {
    it('should clear cached user and expiry', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // Cache a user
      await adapter.getCurrentUser();
      expect(adapter._cachedUser).toBeDefined();
      expect(adapter._cacheExpiry).toBeDefined();

      // Clear cache
      adapter.clearCache();

      expect(adapter._cachedUser).toBeNull();
      expect(adapter._cacheExpiry).toBeNull();
    });
  });

  describe('_checkAdminStatus', () => {
    it('should return true for admin users', () => {
      const accessToken = {
        payload: { 'cognito:groups': ['portfolio_admin', 'other_group'] }
      };

      const isAdmin = adapter._checkAdminStatus(accessToken);

      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin users', () => {
      const accessToken = {
        payload: { 'cognito:groups': ['regular_user'] }
      };

      const isAdmin = adapter._checkAdminStatus(accessToken);

      expect(isAdmin).toBe(false);
    });

    it('should return false when groups is not an array', () => {
      const accessToken = {
        payload: { 'cognito:groups': 'portfolio_admin' }
      };

      const isAdmin = adapter._checkAdminStatus(accessToken);

      expect(isAdmin).toBe(false);
    });

    it('should return false when groups is missing', () => {
      const accessToken = {
        payload: {}
      };

      const isAdmin = adapter._checkAdminStatus(accessToken);

      expect(isAdmin).toBe(false);
    });
  });

  describe('cache behavior', () => {
    it('should respect custom CACHE_TTL', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // Set custom TTL
      adapter.CACHE_TTL = 100;

      await adapter.getCurrentUser();
      const cachedExpiry = adapter._cacheExpiry;

      expect(cachedExpiry).toBeGreaterThan(Date.now());
      expect(cachedExpiry).toBeLessThanOrEqual(Date.now() + 100);
    });

    it('should clear cache on auth errors', async () => {
      const mockTokens = createMockTokens();
      fetchAuthSession.mockResolvedValue({ tokens: mockTokens });

      // Cache a user
      await adapter.getCurrentUser();
      expect(adapter._cachedUser).toBeDefined();

      // Simulate error
      fetchAuthSession.mockRejectedValue(new Error('Auth error'));
      adapter.clearCache();
      await adapter.getCurrentUser();

      expect(adapter._cachedUser).toBeNull();
    });
  });
});
