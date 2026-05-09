import { IStorageAdapter } from './IStorageAdapter';

/**
 * localStorage Adapter
 * Implements persistent storage using browser's localStorage
 */
export class LocalStorageAdapter extends IStorageAdapter {
  constructor(prefix = 'photoportfolio_') {
    super();
    this.prefix = prefix;
    this._checkAvailability();
  }

  /**
   * Check if localStorage is available
   * @private
   */
  _checkAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('localStorage not available');
      }
      // Test storage availability
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      console.warn('localStorage is not available:', error);
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
   * Get item from localStorage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(this._getKey(key));
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(this._getKey(key), value);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
      // Handle quota exceeded errors
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this._getKey(key));
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  }

  /**
   * Clear all prefixed items from localStorage
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      if (typeof window === 'undefined') return;
      const keys = await this.keys();
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  /**
   * Get all prefixed keys from localStorage
   * @returns {Promise<string[]>}
   */
  async keys() {
    try {
      if (typeof window === 'undefined') return [];
      const allKeys = Object.keys(localStorage);
      return allKeys.filter(key => key.startsWith(this.prefix));
    } catch (error) {
      console.error('LocalStorage keys error:', error);
      return [];
    }
  }
}
