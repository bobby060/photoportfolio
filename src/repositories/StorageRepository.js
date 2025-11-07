/**
 * Storage Repository
 * Provides high-level storage operations with JSON serialization and TTL support
 */
export class StorageRepository {
  constructor(storageAdapter) {
    this.adapter = storageAdapter;
  }

  /**
   * Get item from storage (raw string)
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async get(key) {
    return this.adapter.getItem(key);
  }

  /**
   * Set item in storage (raw string)
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    return this.adapter.setItem(key, value);
  }

  /**
   * Get item from storage and parse as JSON
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async getJSON(key) {
    const value = await this.adapter.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  }

  /**
   * Stringify value as JSON and store
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async setJSON(key, value) {
    try {
      const serialized = JSON.stringify(value);
      await this.adapter.setItem(key, serialized);
    } catch (error) {
      console.error('JSON stringify error:', error);
      throw error;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async remove(key) {
    return this.adapter.removeItem(key);
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    return this.adapter.clear();
  }

  /**
   * Get all storage keys
   * @returns {Promise<string[]>}
   */
  async keys() {
    return this.adapter.keys();
  }

  /**
   * Set item with Time-To-Live (TTL)
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs - Time to live in milliseconds
   * @returns {Promise<void>}
   */
  async setWithTTL(key, value, ttlMs) {
    const data = {
      value,
      expiry: Date.now() + ttlMs
    };
    await this.setJSON(key, data);
  }

  /**
   * Get item with TTL check (returns null if expired)
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async getWithTTL(key) {
    const data = await this.getJSON(key);
    if (!data) return null;

    // Check if data has expired
    if (data.expiry && Date.now() > data.expiry) {
      await this.remove(key);
      return null;
    }

    return data.value;
  }

  /**
   * Namespaced storage for user preferences
   */
  userPreferences = {
    get: async () => this.getJSON('user_preferences'),
    set: async (prefs) => this.setJSON('user_preferences', prefs),
    clear: async () => this.remove('user_preferences')
  };

  /**
   * Namespaced storage for album cache with TTL
   */
  albumCache = {
    get: async () => this.getWithTTL('album_cache'),
    set: async (albums) => this.setWithTTL('album_cache', albums, 5 * 60 * 1000), // 5 minutes
    clear: async () => this.remove('album_cache')
  };

  /**
   * Namespaced storage for draft album
   */
  draftAlbum = {
    get: async () => this.getJSON('draft_album'),
    set: async (draft) => this.setJSON('draft_album', draft),
    clear: async () => this.remove('draft_album')
  };

  /**
   * Namespaced storage for image upload queue
   */
  uploadQueue = {
    get: async () => this.getJSON('upload_queue') || [],
    set: async (queue) => this.setJSON('upload_queue', queue),
    clear: async () => this.remove('upload_queue'),
    add: async (item) => {
      const queue = await this.uploadQueue.get();
      queue.push(item);
      await this.uploadQueue.set(queue);
    },
    remove: async (itemId) => {
      const queue = await this.uploadQueue.get();
      const filtered = queue.filter(item => item.id !== itemId);
      await this.uploadQueue.set(filtered);
    }
  };
}
