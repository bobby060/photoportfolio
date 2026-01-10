import { MemoryStorageAdapter } from '../../../adapters/storage/MemoryStorageAdapter';

describe('MemoryStorageAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MemoryStorageAdapter();
  });

  describe('getItem', () => {
    it('should return null for non-existent key', async () => {
      const value = await adapter.getItem('nonexistent');
      expect(value).toBeNull();
    });

    it('should return the stored value', async () => {
      await adapter.setItem('testKey', 'testValue');
      const value = await adapter.getItem('testKey');
      expect(value).toBe('testValue');
    });
  });

  describe('setItem', () => {
    it('should store a value', async () => {
      await adapter.setItem('key1', 'value1');
      const value = await adapter.getItem('key1');
      expect(value).toBe('value1');
    });

    it('should overwrite existing values', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key1', 'value2');
      const value = await adapter.getItem('key1');
      expect(value).toBe('value2');
    });

    it('should store multiple values independently', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');

      expect(await adapter.getItem('key1')).toBe('value1');
      expect(await adapter.getItem('key2')).toBe('value2');
    });
  });

  describe('removeItem', () => {
    it('should remove a stored value', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.removeItem('key1');

      const value = await adapter.getItem('key1');
      expect(value).toBeNull();
    });

    it('should not throw when removing non-existent key', async () => {
      await expect(adapter.removeItem('nonexistent')).resolves.not.toThrow();
    });

    it('should only remove the specified key', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');
      await adapter.removeItem('key1');

      expect(await adapter.getItem('key1')).toBeNull();
      expect(await adapter.getItem('key2')).toBe('value2');
    });
  });

  describe('clear', () => {
    it('should remove all stored values', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');
      await adapter.setItem('key3', 'value3');

      await adapter.clear();

      expect(await adapter.getItem('key1')).toBeNull();
      expect(await adapter.getItem('key2')).toBeNull();
      expect(await adapter.getItem('key3')).toBeNull();
    });

    it('should result in size of 0', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.clear();
      expect(adapter.size()).toBe(0);
    });
  });

  describe('keys', () => {
    it('should return empty array when no items stored', async () => {
      const keys = await adapter.keys();
      expect(keys).toEqual([]);
    });

    it('should return all stored keys', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');
      await adapter.setItem('key3', 'value3');

      const keys = await adapter.keys();
      expect(keys).toHaveLength(3);
      // Keys are returned with prefix at adapter level
      expect(keys).toContain('photoportfolio_key1');
      expect(keys).toContain('photoportfolio_key2');
      expect(keys).toContain('photoportfolio_key3');
    });
  });

  describe('size', () => {
    it('should return 0 for empty storage', () => {
      expect(adapter.size()).toBe(0);
    });

    it('should return correct count of stored items', async () => {
      await adapter.setItem('key1', 'value1');
      expect(adapter.size()).toBe(1);

      await adapter.setItem('key2', 'value2');
      expect(adapter.size()).toBe(2);

      await adapter.removeItem('key1');
      expect(adapter.size()).toBe(1);
    });
  });

  describe('getAllEntries', () => {
    it('should return empty object for empty storage', () => {
      const entries = adapter.getAllEntries();
      expect(entries).toEqual({});
    });

    it('should return all key-value pairs', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');

      const entries = adapter.getAllEntries();
      // Entries are returned with prefix at adapter level
      expect(entries).toEqual({
        photoportfolio_key1: 'value1',
        photoportfolio_key2: 'value2'
      });
    });
  });
});
