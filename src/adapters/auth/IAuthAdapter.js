/**
 * @typedef {Object} User
 * @property {string} id - User unique identifier
 * @property {string} username - Username
 * @property {string} email - User email
 * @property {boolean} isAdmin - Admin status
 * @property {Object} tokens - JWT tokens
 * @property {string} tokens.accessToken - Access token
 * @property {string} tokens.idToken - ID token
 */

/**
 * Authentication Adapter Interface
 * All auth adapters must implement these methods
 */
export class IAuthAdapter {
  /**
   * Get currently authenticated user
   * @returns {Promise<User|null>}
   */
  async getCurrentUser() {
    throw new Error('getCurrentUser() must be implemented');
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    throw new Error('signOut() must be implemented');
  }

  /**
   * Get authentication status
   * @returns {Promise<'authenticated'|'unauthenticated'|'configuring'>}
   */
  async getAuthStatus() {
    throw new Error('getAuthStatus() must be implemented');
  }

  /**
   * Refresh authentication tokens
   * @returns {Promise<User|null>}
   */
  async refreshTokens() {
    throw new Error('refreshTokens() must be implemented');
  }

  /**
   * Clear any cached authentication data
   * @returns {void}
   */
  clearCache() {
    throw new Error('clearCache() must be implemented');
  }
}
