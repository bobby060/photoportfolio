import { LocalStorageAdapter } from '../../../adapters/storage/LocalStorageAdapter';

describe('LocalStorageAdapter', () => {
  let adapter;
  let storage;
  let originalObjectKeys;
  let mockLocalStorage;

  beforeEach(() => {
    // Save original Object.keys
    originalObjectKeys = Object.keys;

    // Create internal storage
    storage = {};

    // Create fresh mock for localStorage
    mockLocalStorage = {
      getItem: jest.fn((key) => {
        return storage[key] !== undefined ? storage[key] : null;
      }),
      setItem: jest.fn((key, value) => {
        storage[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete storage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(storage).forEach(k => delete storage[k]);
      })
    };

    // Override global.localStorage
    global.localStorage = mockLocalStorage;
    globalThis.localStorage = mockLocalStorage;

    // Mock Object.keys for localStorage
    Object.keys = jest.fn((obj) => {
      if (obj === mockLocalStorage) {
        return Object.keys(storage);
      }
      return originalObjectKeys(obj);
    });

    adapter = new LocalStorageAdapter();
  });

  afterEach(() => {
    // Restore original Object.keys
    Object.keys = originalObjectKeys;
  });

  describe('constructor', () => {
    it('should initialize with default prefix', () => {
      expect(adapter.prefix).toBe('photoportfolio_');
    });

    it('should initialize with custom prefix', () => {
      const customAdapter = new LocalStorageAdapter('custom_');
      expect(customAdapter.prefix).toBe('custom_');
    });

    it('should check availability on construction', () => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('__storage_test__', 'test');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('__storage_test__');
    });

    it('should handle missing window gracefully', () => {
      delete global.window;

      // Should not throw
      expect(() => new LocalStorageAdapter()).not.toThrow();
    });

    it('should handle missing localStorage gracefully', () => {
      global.window = {};

      // Should not throw
      expect(() => new LocalStorageAdapter()).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      // Should not throw
      expect(() => new LocalStorageAdapter()).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve item with prefixed key', async () => {
      storage['photoportfolio_mykey'] = 'test value';

      const result = await adapter.getItem('mykey');

      expect(result).toBe('test value');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('photoportfolio_mykey');
    });

    it('should return null for non-existent key', async () => {
      const result = await adapter.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null when window is undefined', async () => {
      delete global.window;

      const result = await adapter.getItem('key');

      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await adapter.getItem('key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should store item with prefixed key', async () => {
      await adapter.setItem('mykey', 'myvalue');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'photoportfolio_mykey',
        'myvalue'
      );
      expect(storage['photoportfolio_mykey']).toBe('myvalue');
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.setItem('key', 'value')).resolves.toBeUndefined();
    });

    it('should throw QuotaExceededError as specific error', async () => {
      const quotaError = new Error('Quota exceeded');
      quotaError.name = 'QuotaExceededError';
      mockLocalStorage.setItem.mockImplementation(() => {
        throw quotaError;
      });

      await expect(adapter.setItem('key', 'value'))
        .rejects.toThrow('Storage quota exceeded');
    });

    it('should re-throw other errors', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Other error');
      });

      await expect(adapter.setItem('key', 'value'))
        .rejects.toThrow('Other error');
    });
  });

  describe('removeItem', () => {
    it('should remove item with prefixed key', async () => {
      storage['photoportfolio_mykey'] = 'value';

      await adapter.removeItem('mykey');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('photoportfolio_mykey');
      expect(storage['photoportfolio_mykey']).toBeUndefined();
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      // Should not throw
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all prefixed items', async () => {
      storage['photoportfolio_key1'] = 'value1';
      storage['photoportfolio_key2'] = 'value2';
      storage['other_key'] = 'value3';

      await adapter.clear();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key1');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key2');
    });

    it('should not remove non-prefixed items', async () => {
      storage['photoportfolio_key1'] = 'value1';
      storage['other_key'] = 'value2';

      await adapter.clear();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key1');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('other_key');
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.clear()).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      Object.keys = jest.fn((obj) => {
        if (obj === global.localStorage) {
          throw new Error('Keys error');
        }
        return originalObjectKeys(obj);
      });

      // Should not throw
      await expect(adapter.clear()).resolves.toBeUndefined();
    });
  });

  describe('keys', () => {
    it('should return only prefixed keys', async () => {
      storage['photoportfolio_key1'] = 'value1';
      storage['photoportfolio_key2'] = 'value2';
      storage['other_prefix_key'] = 'value3';
      storage['photoportfolio_key3'] = 'value4';

      const keys = await adapter.keys();

      expect(keys).toEqual([
        'photoportfolio_key1',
        'photoportfolio_key2',
        'photoportfolio_key3'
      ]);
    });

    it('should return empty array when no prefixed keys', async () => {
      storage['other_key1'] = 'value1';
      storage['other_key2'] = 'value2';

      const keys = await adapter.keys();

      expect(keys).toEqual([]);
    });

    it('should return empty array when window undefined', async () => {
      delete global.window;

      const keys = await adapter.keys();

      expect(keys).toEqual([]);
    });

    it('should handle errors and return empty array', async () => {
      Object.keys = jest.fn((obj) => {
        if (obj === global.localStorage) {
          throw new Error('Keys error');
        }
        return originalObjectKeys(obj);
      });

      const keys = await adapter.keys();

      expect(keys).toEqual([]);
    });
  });

  describe('_getKey', () => {
    it('should add prefix to key', () => {
      const result = adapter._getKey('testkey');
      expect(result).toBe('photoportfolio_testkey');
    });

    it('should work with custom prefix', () => {
      const customAdapter = new LocalStorageAdapter('custom_');
      const result = customAdapter._getKey('testkey');
      expect(result).toBe('custom_testkey');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete store-retrieve-remove cycle', async () => {
      // Store
      await adapter.setItem('user', 'john');
      expect(storage['photoportfolio_user']).toBe('john');

      // Retrieve
      const value = await adapter.getItem('user');
      expect(value).toBe('john');

      // Remove
      await adapter.removeItem('user');
      expect(storage['photoportfolio_user']).toBeUndefined();
    });

    it('should maintain namespace isolation', async () => {
      const adapter1 = new LocalStorageAdapter('app1_');
      const adapter2 = new LocalStorageAdapter('app2_');

      await adapter1.setItem('key', 'value1');
      await adapter2.setItem('key', 'value2');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('app1_key', 'value1');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('app2_key', 'value2');
    });

    it('should filter keys by prefix correctly', async () => {
      storage['photoportfolio_auth_token'] = 'token';
      storage['photoportfolio_user_data'] = 'data';
      storage['different_app_key'] = 'diff';
      storage['photoportfolio_settings'] = 'settings';

      const keys = await adapter.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('photoportfolio_auth_token');
      expect(keys).toContain('photoportfolio_user_data');
      expect(keys).toContain('photoportfolio_settings');
      expect(keys).not.toContain('different_app_key');
    });
  });

  describe('SSR compatibility', () => {
    it('should handle server-side rendering (no window)', async () => {
      delete global.window;

      await expect(adapter.setItem('key', 'value')).resolves.toBeUndefined();
      await expect(adapter.getItem('key')).resolves.toBeNull();
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
      await expect(adapter.clear()).resolves.toBeUndefined();
      await expect(adapter.keys()).resolves.toEqual([]);
    });

    it('should handle hydration gracefully', async () => {
      // Start without window (SSR)
      delete global.window;
      await adapter.setItem('ssr_key', 'ssr_value');

      // Add window (client-side hydration)
      global.window = { localStorage: global.localStorage };
      storage['photoportfolio_client_key'] = 'client_value';

      const value = await adapter.getItem('client_key');
      expect(value).toBe('client_value');
    });
  });
});
