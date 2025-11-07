import { IStorageAdapter } from './IStorageAdapter';

/**
 * Memory Storage Adapter for Testing and SSR
 * Implements in-memory storage without browser dependencies
 */
export class MemoryStorageAdapter extends IStorageAdapter {
  constructor() {
    super();
    this.storage = new Map();
  }

  /**
   * Get item from memory storage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    return this.storage.get(key) || null;
  }

  /**
   * Set item in memory storage
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    this.storage.set(key, value);
  }

  /**
   * Remove item from memory storage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    this.storage.delete(key);
  }

  /**
   * Clear all items from memory storage
   * @returns {Promise<void>}
   */
  async clear() {
    this.storage.clear();
  }

  /**
   * Get all keys from memory storage
   * @returns {Promise<string[]>}
   */
  async keys() {
    return Array.from(this.storage.keys());
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
