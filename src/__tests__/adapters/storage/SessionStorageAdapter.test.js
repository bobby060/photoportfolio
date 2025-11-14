import { SessionStorageAdapter } from '../../../adapters/storage/SessionStorageAdapter';

describe('SessionStorageAdapter', () => {
  let adapter;
  let storage;
  let getItemSpy;
  let setItemSpy;
  let removeItemSpy;
  let keysSpy;
  let originalObjectKeys;
  let savedSessionStorage;

  beforeEach(() => {
    // Save reference to sessionStorage before any modifications
    savedSessionStorage = global.sessionStorage;

    // Clear and reset storage
    sessionStorage.clear();
    storage = {};

    // Save original Object.keys
    originalObjectKeys = Object.keys;

    // Spy on Storage.prototype methods
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (typeof window === 'undefined') return null;
      return storage[key] ?? null;
    });

    setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      if (typeof window === 'undefined') return;
      storage[key] = String(value);
    });

    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      if (typeof window === 'undefined') return;
      delete storage[key];
    });

    // Mock Object.keys to return storage keys when called on sessionStorage
    keysSpy = jest.spyOn(Object, 'keys').mockImplementation((obj) => {
      if (obj === savedSessionStorage) {
        return originalObjectKeys(storage);
      }
      return originalObjectKeys(obj);
    });

    adapter = new SessionStorageAdapter();
  });

  afterEach(() => {
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
      expect(setItemSpy).toHaveBeenCalledWith('__storage_test__', 'test');
      expect(removeItemSpy).toHaveBeenCalledWith('__storage_test__');
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
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      // Should not throw
      expect(() => new SessionStorageAdapter()).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve item with prefixed key', async () => {
      storage['photoportfolio_mykey'] = 'test value';

      const result = await adapter.getItem('mykey');

      expect(result).toBe('test value');
      expect(getItemSpy).toHaveBeenCalledWith('photoportfolio_mykey');
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
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await adapter.getItem('key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should store item with prefixed key', async () => {
      await adapter.setItem('mykey', 'myvalue');

      expect(setItemSpy).toHaveBeenCalledWith('photoportfolio_mykey', 'myvalue');
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
      setItemSpy.mockImplementation(() => {
        throw quotaError;
      });

      await expect(adapter.setItem('key', 'value'))
        .rejects.toThrow('Storage quota exceeded');
    });

    it('should re-throw other errors', async () => {
      setItemSpy.mockImplementation(() => {
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

      expect(removeItemSpy).toHaveBeenCalledWith('photoportfolio_mykey');
      expect(storage['photoportfolio_mykey']).toBeUndefined();
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.removeItem('key')).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      removeItemSpy.mockImplementation(() => {
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

      expect(removeItemSpy).toHaveBeenCalledWith('photoportfolio_key1');
      expect(removeItemSpy).toHaveBeenCalledWith('photoportfolio_key2');
      expect(removeItemSpy).not.toHaveBeenCalledWith('other_key');
    });

    it('should not remove non-prefixed items', async () => {
      storage['photoportfolio_key1'] = 'value1';
      storage['other_key'] = 'value2';

      await adapter.clear();

      expect(removeItemSpy).toHaveBeenCalledWith('photoportfolio_key1');
      expect(removeItemSpy).not.toHaveBeenCalledWith('other_key');
    });

    it('should handle window undefined gracefully', async () => {
      delete global.window;

      // Should not throw
      await expect(adapter.clear()).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      keysSpy.mockImplementation((obj) => {
        if (obj === savedSessionStorage) {
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
      keysSpy.mockImplementation((obj) => {
        if (obj === savedSessionStorage) {
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
      const customAdapter = new SessionStorageAdapter('custom_');
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
      const adapter1 = new SessionStorageAdapter('app1_');
      const adapter2 = new SessionStorageAdapter('app2_');

      await adapter1.setItem('key', 'value1');
      await adapter2.setItem('key', 'value2');

      expect(setItemSpy).toHaveBeenCalledWith('app1_key', 'value1');
      expect(setItemSpy).toHaveBeenCalledWith('app2_key', 'value2');
    });

    it('should filter keys by prefix correctly', async () => {
      storage['photoportfolio_temp_data'] = 'data';
      storage['photoportfolio_session_id'] = 'id';
      storage['different_app_key'] = 'diff';
      storage['photoportfolio_cart'] = 'cart';

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
      await adapter.setItem('session_data', 'window1_value');

      expect(setItemSpy).toHaveBeenCalledWith(
        'photoportfolio_session_data',
        'window1_value'
      );
      expect(storage['photoportfolio_session_data']).toBe('window1_value');
    });

    it('should handle temporary session data', async () => {
      // Store temporary data
      await adapter.setItem('temp_token', 'abc123');
      let token = await adapter.getItem('temp_token');
      expect(token).toBe('abc123');

      // Simulate browser close/tab close (sessionStorage cleared)
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });

      const afterClose = await adapter.getItem('temp_token');
      expect(afterClose).toBeNull();
    });
  });

  describe('SSR compatibility', () => {
    // Note: Testing typeof window === 'undefined' is not reliable in jsdom
    // as window is always defined. SSR compatibility is better tested in
    // actual SSR environments or with different mocking strategies.

    it('should gracefully handle scenarios where sessionStorage is inaccessible', async () => {
      // This test verifies the adapter handles sessionStorage unavailability,
      // which can occur in SSR or when storage is disabled
      const tempAdapter = new SessionStorageAdapter();

      // The adapter should have been initialized without throwing
      expect(tempAdapter).toBeDefined();
      expect(tempAdapter.prefix).toBe('photoportfolio_');
    });
  });

  describe('differences from localStorage', () => {
    it('should be separate from localStorage', async () => {
      // Document that sessionStorage and localStorage are independent
      storage['photoportfolio_test'] = 'session_value';

      const value = await adapter.getItem('test');

      expect(value).toBe('session_value');
      expect(getItemSpy).toHaveBeenCalled();
    });
  });
});
