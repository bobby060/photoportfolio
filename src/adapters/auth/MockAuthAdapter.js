import { IAuthAdapter } from './IAuthAdapter';

/**
 * Mock Authentication Adapter for Testing
 * Simulates authentication without external dependencies
 */
export class MockAuthAdapter extends IAuthAdapter {
  constructor(initialUser = null) {
    super();
    this.mockUser = initialUser;
    this.signOutCalled = false;
    this.refreshCalled = false;
  }

  /**
   * Get currently authenticated mock user
   * @returns {Promise<User|null>}
   */
  async getCurrentUser() {
    return this.mockUser;
  }

  /**
   * Set the mock user (for testing)
   * @param {User|null} user
   */
  setMockUser(user) {
    this.mockUser = user;
  }

  /**
   * Mock sign out
   * @returns {Promise<void>}
   */
  async signOut() {
    this.signOutCalled = true;
    this.mockUser = null;
  }

  /**
   * Mock refresh tokens
   * @returns {Promise<User|null>}
   */
  async refreshTokens() {
    this.refreshCalled = true;
    return this.mockUser;
  }

  /**
   * Get mock authentication status
   * @returns {Promise<'authenticated'|'unauthenticated'>}
   */
  async getAuthStatus() {
    return this.mockUser ? 'authenticated' : 'unauthenticated';
  }

  /**
   * Clear cache (no-op for mock)
   * @returns {void}
   */
  clearCache() {
    // No-op for mock adapter
  }

  /**
   * Reset mock state (for testing)
   */
  reset() {
    this.mockUser = null;
    this.signOutCalled = false;
    this.refreshCalled = false;
  }

  /**
   * Create a mock admin user (helper for testing)
   * @param {Object} overrides - Override default user properties
   * @returns {User}
   */
  static createMockAdminUser(overrides = {}) {
    return {
      id: 'mock-admin-123',
      username: 'mockadmin',
      email: 'admin@example.com',
      isAdmin: true,
      tokens: {
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token'
      },
      ...overrides
    };
  }

  /**
   * Create a mock regular user (helper for testing)
   * @param {Object} overrides - Override default user properties
   * @returns {User}
   */
  static createMockUser(overrides = {}) {
    return {
      id: 'mock-user-456',
      username: 'mockuser',
      email: 'user@example.com',
      isAdmin: false,
      tokens: {
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token'
      },
      ...overrides
    };
  }
}
