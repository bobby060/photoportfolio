import { IStorageAdapter } from './IStorageAdapter';

/**
 * sessionStorage Adapter
 * Implements session-based storage using browser's sessionStorage
 */
export class SessionStorageAdapter extends IStorageAdapter {
  constructor(prefix = 'photoportfolio_') {
    super();
    this.prefix = prefix;
    this._checkAvailability();
  }

  /**
   * Check if sessionStorage is available
   * @private
   */
  _checkAvailability() {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        throw new Error('sessionStorage not available');
      }
      // Test storage availability
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
    } catch (error) {
      console.warn('sessionStorage is not available:', error);
    }
  }

  /**
   * Get prefixed key
   * @private
   * @param {string} key
   * @returns {string}
   */
  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get item from sessionStorage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    try {
      if (typeof window === 'undefined') return null;
      return sessionStorage.getItem(this._getKey(key));
    } catch (error) {
      console.error('SessionStorage getItem error:', error);
      return null;
    }
  }

  /**
   * Set item in sessionStorage
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.setItem(this._getKey(key), value);
    } catch (error) {
      console.error('SessionStorage setItem error:', error);
      // Handle quota exceeded errors
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  }

  /**
   * Remove item from sessionStorage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(this._getKey(key));
    } catch (error) {
      console.error('SessionStorage removeItem error:', error);
    }
  }

  /**
   * Clear all prefixed items from sessionStorage
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      if (typeof window === 'undefined') return;
      const keys = await this.keys();
      keys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('SessionStorage clear error:', error);
    }
  }

  /**
   * Get all prefixed keys from sessionStorage
   * @returns {Promise<string[]>}
   */
  async keys() {
    try {
      if (typeof window === 'undefined') return [];
      const allKeys = Object.keys(sessionStorage);
      return allKeys.filter(key => key.startsWith(this.prefix));
    } catch (error) {
      console.error('SessionStorage keys error:', error);
      return [];
    }
  }
}
