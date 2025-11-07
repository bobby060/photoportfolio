import { StorageRepository } from '../../repositories/StorageRepository';
import { MemoryStorageAdapter } from '../../adapters/storage/MemoryStorageAdapter';

describe('StorageRepository', () => {
  let adapter;
  let repository;

  beforeEach(() => {
    adapter = new MemoryStorageAdapter();
    repository = new StorageRepository(adapter);
  });

  describe('get and set', () => {
    it('should store and retrieve raw string values', async () => {
      await repository.set('key1', 'value1');
      const value = await repository.get('key1');
      expect(value).toBe('value1');
    });

    it('should return null for non-existent keys', async () => {
      const value = await repository.get('nonexistent');
      expect(value).toBeNull();
    });
  });

  describe('getJSON and setJSON', () => {
    it('should serialize and deserialize JSON objects', async () => {
      const obj = { name: 'Test', count: 42, nested: { value: true } };
      await repository.setJSON('testObj', obj);

      const retrieved = await repository.getJSON('testObj');
      expect(retrieved).toEqual(obj);
    });

    it('should handle arrays', async () => {
      const arr = [1, 2, 3, { id: 'test' }];
      await repository.setJSON('testArr', arr);

      const retrieved = await repository.getJSON('testArr');
      expect(retrieved).toEqual(arr);
    });

    it('should return null for non-existent keys', async () => {
      const value = await repository.getJSON('nonexistent');
      expect(value).toBeNull();
    });

    it('should return null for invalid JSON', async () => {
      await repository.set('invalidJson', 'not valid json {');
      const value = await repository.getJSON('invalidJson');
      expect(value).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove stored values', async () => {
      await repository.set('key1', 'value1');
      await repository.remove('key1');

      const value = await repository.get('key1');
      expect(value).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove all stored values', async () => {
      await repository.set('key1', 'value1');
      await repository.set('key2', 'value2');
      await repository.clear();

      expect(await repository.get('key1')).toBeNull();
      expect(await repository.get('key2')).toBeNull();
    });
  });

  describe('keys', () => {
    it('should return all stored keys', async () => {
      await repository.set('key1', 'value1');
      await repository.set('key2', 'value2');

      const keys = await repository.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('setWithTTL and getWithTTL', () => {
    it('should store value with expiry', async () => {
      await repository.setWithTTL('ttlKey', { data: 'test' }, 1000);

      const value = await repository.getWithTTL('ttlKey');
      expect(value).toEqual({ data: 'test' });
    });

    it('should return null for expired values', async () => {
      await repository.setWithTTL('ttlKey', { data: 'test' }, -1000); // Already expired

      const value = await repository.getWithTTL('ttlKey');
      expect(value).toBeNull();
    });

    it('should remove expired value from storage', async () => {
      await repository.setWithTTL('ttlKey', { data: 'test' }, -1000);
      await repository.getWithTTL('ttlKey');

      // The expired key should be removed
      const rawValue = await repository.get('ttlKey');
      expect(rawValue).toBeNull();
    });

    it('should not return value before expiry time', async () => {
      await repository.setWithTTL('ttlKey', { data: 'test' }, 5000);

      const value = await repository.getWithTTL('ttlKey');
      expect(value).toEqual({ data: 'test' });
    });
  });

  describe('userPreferences namespace', () => {
    it('should get and set user preferences', async () => {
      const prefs = { theme: 'dark', gridSize: 'large' };
      await repository.userPreferences.set(prefs);

      const retrieved = await repository.userPreferences.get();
      expect(retrieved).toEqual(prefs);
    });

    it('should clear user preferences', async () => {
      await repository.userPreferences.set({ theme: 'dark' });
      await repository.userPreferences.clear();

      const retrieved = await repository.userPreferences.get();
      expect(retrieved).toBeNull();
    });
  });

  describe('albumCache namespace', () => {
    it('should cache albums with TTL', async () => {
      const albums = [{ id: '1', title: 'Album 1' }];
      await repository.albumCache.set(albums);

      const retrieved = await repository.albumCache.get();
      expect(retrieved).toEqual(albums);
    });

    it('should clear album cache', async () => {
      await repository.albumCache.set([{ id: '1' }]);
      await repository.albumCache.clear();

      const retrieved = await repository.albumCache.get();
      expect(retrieved).toBeNull();
    });
  });

  describe('draftAlbum namespace', () => {
    it('should save and retrieve draft album', async () => {
      const draft = { title: 'Draft Album', desc: 'Work in progress' };
      await repository.draftAlbum.set(draft);

      const retrieved = await repository.draftAlbum.get();
      expect(retrieved).toEqual(draft);
    });

    it('should clear draft album', async () => {
      await repository.draftAlbum.set({ title: 'Draft' });
      await repository.draftAlbum.clear();

      const retrieved = await repository.draftAlbum.get();
      expect(retrieved).toBeNull();
    });
  });

  describe('uploadQueue namespace', () => {
    it('should return empty array for empty queue', async () => {
      const queue = await repository.uploadQueue.get();
      expect(queue).toEqual([]);
    });

    it('should add items to queue', async () => {
      await repository.uploadQueue.add({ id: '1', file: 'test.jpg' });
      await repository.uploadQueue.add({ id: '2', file: 'test2.jpg' });

      const queue = await repository.uploadQueue.get();
      expect(queue).toHaveLength(2);
      expect(queue[0]).toEqual({ id: '1', file: 'test.jpg' });
    });

    it('should remove items from queue', async () => {
      await repository.uploadQueue.add({ id: '1', file: 'test.jpg' });
      await repository.uploadQueue.add({ id: '2', file: 'test2.jpg' });
      await repository.uploadQueue.remove('1');

      const queue = await repository.uploadQueue.get();
      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe('2');
    });

    it('should clear upload queue', async () => {
      await repository.uploadQueue.add({ id: '1', file: 'test.jpg' });
      await repository.uploadQueue.clear();

      const queue = await repository.uploadQueue.get();
      expect(queue).toEqual([]);
    });

    it('should set entire queue', async () => {
      const newQueue = [
        { id: '1', file: 'test.jpg' },
        { id: '2', file: 'test2.jpg' }
      ];
      await repository.uploadQueue.set(newQueue);

      const queue = await repository.uploadQueue.get();
      expect(queue).toEqual(newQueue);
    });
  });
});
