/**
 * Authentication Repository
 * Handles authentication business logic and provides a clean API
 */
export class AuthRepository {
  constructor(authAdapter) {
    this.adapter = authAdapter;
  }

  /**
   * Get current authenticated user
   * @returns {Promise<User|null>}
   */
  async getUser() {
    return this.adapter.getCurrentUser();
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const user = await this.getUser();
    return user !== null;
  }

  /**
   * Check if user has admin privileges
   * @returns {Promise<boolean>}
   */
  async isAdmin() {
    const user = await this.getUser();
    return user?.isAdmin ?? false;
  }

  /**
   * Get user information (without tokens)
   * @returns {Promise<{username: string, email: string, isAdmin: boolean}|null>}
   */
  async getUserInfo() {
    const user = await this.getUser();
    if (!user) return null;

    return {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    return this.adapter.signOut();
  }

  /**
   * Refresh user session
   * @returns {Promise<User|null>}
   */
  async refreshSession() {
    return this.adapter.refreshTokens();
  }

  /**
   * Require authentication (throws if not authenticated)
   * @throws {Error} If user is not authenticated
   * @returns {Promise<void>}
   */
  async requireAuth() {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      throw new Error('Authentication required');
    }
  }

  /**
   * Require admin privileges (throws if not admin)
   * @throws {Error} If user is not an admin
   * @returns {Promise<void>}
   */
  async requireAdmin() {
    const isAdminUser = await this.isAdmin();
    if (!isAdminUser) {
      throw new Error('Admin privileges required');
    }
  }

  /**
   * Clear cached authentication data
   * @returns {void}
   */
  clearCache() {
    this.adapter.clearCache();
  }
}
