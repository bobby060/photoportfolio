import { SessionStorageAdapter } from '../../../adapters/storage/SessionStorageAdapter';

describe('SessionStorageAdapter', () => {
  let adapter;
  let mockSessionStorage;
  let originalObjectKeys;

  beforeEach(() => {
    // Save original Object.keys
    originalObjectKeys = Object.keys;

    // Create mock sessionStorage with stateful implementation
    const storage = {};
    mockSessionStorage = {
      getItem: jest.fn((key) => storage[key] !== undefined ? storage[key] : null),
      setItem: jest.fn((key, value) => { storage[key] = String(value); }),
      removeItem: jest.fn((key) => { delete storage[key]; }),
      clear: jest.fn(() => { Object.keys(storage).forEach(k => delete storage[k]); }),
      key: jest.fn(),
      length: 0,
      _storage: storage  // Internal storage for testing
    };

    // Set window.sessionStorage (preserve other window properties like matchMedia)
    global.window = {
      ...global.window,
      sessionStorage: mockSessionStorage
    };

    // Make window available as a global variable (not just global.window)
    globalThis.window = global.window;

    // Also set global.sessionStorage since the adapter accesses it directly
    global.sessionStorage = mockSessionStorage;
    globalThis.sessionStorage = mockSessionStorage;

    // Mock Object.keys for sessionStorage
    Object.keys = jest.fn((obj) => {
      if (obj === mockSessionStorage) {
        return ['photoportfolio_key1', 'photoportfolio_key2', 'other_key'];
      }
      return originalObjectKeys(obj);  // Use original for other objects
    });

    adapter = new SessionStorageAdapter();
  });

  afterEach(() => {
    // Restore original Object.keys
    Object.keys = originalObjectKeys;
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default prefix', () => {
      expect(adapter.prefix).toBe('photoportfolio_');
    });

    it('should initialize with custom prefix', () => {
      const customAdapter = new SessionStorageAdapter('custom_');
      expect(customAdapter.prefix).toBe('custom_');
    });

    it('should check availability on construction', () => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('__storage_test__', 'test');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('__storage_test__');
    });

    it('should handle missing window gracefully', () => {
      delete global.window;

      // Should not throw
      expect(() => new SessionStorageAdapter()).not.toThrow();
    });

    it('should handle missing sessionStorage gracefully', () => {
      global.window = {};

      // Should not throw
      expect(() => new SessionStorageAdapter()).not.toThrow();
    });

    it('should handle sessionStorage errors gracefully', () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      // Should not throw
      expect(() => new SessionStorageAdapter()).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve item with prefixed key', async () => {
      mockSessionStorage.getItem.mockReturnValue('test value');

      const result = await adapter.getItem('mykey');

      expect(result).toBe('test value');
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('photoportfolio_mykey');
    });

    it('should return null for non-existent key', async () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      const result = await adapter.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null when window is undefined', async () => {
      delete global.window;

      const result = await adapter.getItem('key');

      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await adapter.getItem('key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should store item with prefixed key', async () => {
      await adapter.setItem('mykey', 'myvalue');

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'photoportfolio_mykey',
        'myvalue'
      );
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.setItem('key', 'value')).resolves.toBeUndefined();
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should throw QuotaExceededError as specific error', async () => {
      const quotaError = new Error('Quota exceeded');
      quotaError.name = 'QuotaExceededError';
      mockSessionStorage.setItem.mockImplementation(() => {
        throw quotaError;
      });

      await expect(adapter.setItem('key', 'value'))
        .rejects.toThrow('Storage quota exceeded');
    });

    it('should re-throw other errors', async () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Other error');
      });

      await expect(adapter.setItem('key', 'value'))
        .rejects.toThrow('Other error');
    });
  });

  describe('removeItem', () => {
    it('should remove item with prefixed key', async () => {
      await adapter.removeItem('mykey');

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('photoportfolio_mykey');
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockSessionStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove error');
      });

      // Should not throw
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all prefixed items', async () => {
      // Mock keys() to return prefixed keys
      Object.keys = jest.fn(() => ['photoportfolio_key1', 'photoportfolio_key2']);

      await adapter.clear();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key1');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key2');
    });

    it('should not remove non-prefixed items', async () => {
      Object.keys = jest.fn(() => ['photoportfolio_key1', 'other_key']);

      await adapter.clear();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('photoportfolio_key1');
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalledWith('other_key');
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.clear()).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      Object.keys = jest.fn((obj) => {
        if (obj === mockSessionStorage) {
          throw new Error('Keys error');
        }
        return Object.getOwnPropertyNames(obj);
      });

      // Should not throw
      await expect(adapter.clear()).resolves.toBeUndefined();
    });
  });

  describe('keys', () => {
    it('should return only prefixed keys', async () => {
      Object.keys = jest.fn(() => [
        'photoportfolio_key1',
        'photoportfolio_key2',
        'other_prefix_key',
        'photoportfolio_key3'
      ]);

      const keys = await adapter.keys();

      expect(keys).toEqual([
        'photoportfolio_key1',
        'photoportfolio_key2',
        'photoportfolio_key3'
      ]);
    });

    it('should return empty array when no prefixed keys', async () => {
      Object.keys = jest.fn(() => ['other_key1', 'other_key2']);

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
        if (obj === mockSessionStorage) {
          throw new Error('Keys error');
        }
        return Object.getOwnPropertyNames(obj);
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
      const customAdapter = new SessionStorageAdapter('custom_');
      const result = customAdapter._getKey('testkey');
      expect(result).toBe('custom_testkey');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete store-retrieve-remove cycle', async () => {
      mockSessionStorage.setItem.mockImplementation((key, value) => {
        mockSessionStorage[key] = value;
      });
      mockSessionStorage.getItem.mockImplementation((key) => {
        return mockSessionStorage[key] || null;
      });
      mockSessionStorage.removeItem.mockImplementation((key) => {
        delete mockSessionStorage[key];
      });

      // Store
      await adapter.setItem('user', 'john');
      expect(mockSessionStorage['photoportfolio_user']).toBe('john');

      // Retrieve
      const value = await adapter.getItem('user');
      expect(value).toBe('john');

      // Remove
      await adapter.removeItem('user');
      expect(mockSessionStorage['photoportfolio_user']).toBeUndefined();
    });

    it('should maintain namespace isolation', async () => {
      const adapter1 = new SessionStorageAdapter('app1_');
      const adapter2 = new SessionStorageAdapter('app2_');

      await adapter1.setItem('key', 'value1');
      await adapter2.setItem('key', 'value2');

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('app1_key', 'value1');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('app2_key', 'value2');
    });

    it('should filter keys by prefix correctly', async () => {
      Object.keys = jest.fn(() => [
        'photoportfolio_temp_data',
        'photoportfolio_session_id',
        'different_app_key',
        'photoportfolio_cart'
      ]);

      const keys = await adapter.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('photoportfolio_temp_data');
      expect(keys).toContain('photoportfolio_session_id');
      expect(keys).toContain('photoportfolio_cart');
      expect(keys).not.toContain('different_app_key');
    });
  });

  describe('session-specific behavior', () => {
    it('should be isolated per browser tab/window', async () => {
      // sessionStorage is per-window, not shared like localStorage
      // This test documents the expected behavior

      mockSessionStorage.setItem.mockImplementation((key, value) => {
        mockSessionStorage[key] = value;
      });

      await adapter.setItem('session_data', 'window1_value');

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'photoportfolio_session_data',
        'window1_value'
      );
    });

    it('should handle temporary session data', async () => {
      mockSessionStorage.setItem.mockImplementation((key, value) => {
        mockSessionStorage[key] = value;
      });
      mockSessionStorage.getItem.mockImplementation((key) => {
        return mockSessionStorage[key] || null;
      });

      // Store temporary data
      await adapter.setItem('temp_token', 'abc123');
      const token = await adapter.getItem('temp_token');

      expect(token).toBe('abc123');

      // Simulate browser close/tab close (sessionStorage cleared)
      Object.keys(mockSessionStorage).forEach(key => {
        delete mockSessionStorage[key];
      });

      mockSessionStorage.getItem.mockReturnValue(null);
      const afterClose = await adapter.getItem('temp_token');
      expect(afterClose).toBeNull();
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
      global.window = { sessionStorage: mockSessionStorage };
      mockSessionStorage.getItem.mockReturnValue('client_value');

      const value = await adapter.getItem('client_key');
      expect(value).toBe('client_value');
    });
  });

  describe('differences from localStorage', () => {
    it('should be separate from localStorage', async () => {
      // Document that sessionStorage and localStorage are independent
      const mockLocalStorage = {
        getItem: jest.fn().mockReturnValue('local_value'),
        setItem: jest.fn()
      };

      global.window = {
        ...global.window,
        sessionStorage: mockSessionStorage,
        localStorage: mockLocalStorage
      };

      // Also update global variables
      global.sessionStorage = mockSessionStorage;
      global.localStorage = mockLocalStorage;

      mockSessionStorage.getItem.mockReturnValue('session_value');

      const value = await adapter.getItem('test');

      expect(value).toBe('session_value');
      expect(mockSessionStorage.getItem).toHaveBeenCalled();
      expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
    });
  });
});
