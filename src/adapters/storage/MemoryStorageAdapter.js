import { IStorageAdapter } from './IStorageAdapter';

/**
 * Memory Storage Adapter for Testing and SSR
 * Implements in-memory storage without browser dependencies
 */
export class MemoryStorageAdapter extends IStorageAdapter {
  constructor(prefix = 'photoportfolio_') {
    super();
    this.storage = new Map();
    this.prefix = prefix;
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
   * Get item from memory storage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    return this.storage.get(this._getKey(key)) || null;
  }

  /**
   * Set item in memory storage
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    this.storage.set(this._getKey(key), value);
  }

  /**
   * Remove item from memory storage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    this.storage.delete(this._getKey(key));
  }

  /**
   * Clear all items from memory storage
   * @returns {Promise<void>}
   */
  async clear() {
    this.storage.clear();
  }

  /**
   * Get all keys from memory storage (with prefix)
   * @returns {Promise<string[]>}
   */
  async keys() {
    const allKeys = Array.from(this.storage.keys());
    return allKeys.filter(key => key.startsWith(this.prefix));
  }

  /**
   * Get the current size of storage (for testing)
   * @returns {number}
   */
  size() {
    return this.storage.size;
  }

  /**
   * Get all entries (for testing)
   * @returns {Object}
   */
  getAllEntries() {
    return Object.fromEntries(this.storage);
  }
}
