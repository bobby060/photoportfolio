/**
 * Storage Adapter Interface
 * All storage adapters must implement these methods
 */
export class IStorageAdapter {
  /**
   * Get item from storage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getItem(key) {
    throw new Error('getItem() must be implemented');
  }

  /**
   * Set item in storage
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    throw new Error('setItem() must be implemented');
  }

  /**
   * Remove item from storage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    throw new Error('removeItem() must be implemented');
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error('clear() must be implemented');
  }

  /**
   * Get all keys
   * @returns {Promise<string[]>}
   */
  async keys() {
    throw new Error('keys() must be implemented');
  }
}
