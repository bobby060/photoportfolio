import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';
import { IAuthAdapter } from './IAuthAdapter';

/**
 * AWS Amplify Authentication Adapter
 * Implements authentication using AWS Cognito via Amplify
 */
export class AmplifyAuthAdapter extends IAuthAdapter {
  constructor() {
    super();
    this._cachedUser = null;
    this._cacheExpiry = null;
    this.CACHE_TTL = 60000; // 1 minute cache
  }

  /**
   * Get currently authenticated user with caching
   * @returns {Promise<User|null>}
   */
  async getCurrentUser() {
    // Return cached user if still valid
    if (this._cachedUser && this._cacheExpiry && Date.now() < this._cacheExpiry) {
      return this._cachedUser;
    }

    try {
      const { tokens } = await fetchAuthSession();

      if (!tokens || !tokens.accessToken || !tokens.idToken) {
        this._cachedUser = null;
        this._cacheExpiry = null;
        return null;
      }

      const user = {
        id: tokens.idToken.payload.sub,
        username: tokens.idToken.payload['cognito:username'],
        email: tokens.idToken.payload.email || '',
        isAdmin: this._checkAdminStatus(tokens.accessToken),
        tokens: {
          accessToken: tokens.accessToken.toString(),
          idToken: tokens.idToken.toString()
        }
      };

      this._cachedUser = user;
      this._cacheExpiry = Date.now() + this.CACHE_TTL;

      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      this._cachedUser = null;
      this._cacheExpiry = null;
      return null;
    }
  }

  /**
   * Check if user has admin privileges
   * @private
   * @param {Object} accessToken - Cognito access token
   * @returns {boolean}
   */
  _checkAdminStatus(accessToken) {
    const groups = accessToken.payload['cognito:groups'];
    return Array.isArray(groups) && groups.includes('portfolio_admin');
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await amplifySignOut();
      this.clearCache();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication tokens and update cache
   * @returns {Promise<User|null>}
   */
  async refreshTokens() {
    this.clearCache();
    return this.getCurrentUser();
  }

  /**
   * Get authentication status
   * @returns {Promise<'authenticated'|'unauthenticated'>}
   */
  async getAuthStatus() {
    const user = await this.getCurrentUser();
    return user ? 'authenticated' : 'unauthenticated';
  }

  /**
   * Clear cached user data
   * @returns {void}
   */
  clearCache() {
    this._cachedUser = null;
    this._cacheExpiry = null;
  }
}
