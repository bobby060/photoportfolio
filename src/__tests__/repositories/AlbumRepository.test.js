import { AlbumRepository } from '../../repositories/AlbumRepository';
import { MockApiAdapter } from '../../adapters/api/MockApiAdapter';

describe('AlbumRepository', () => {
  let adapter;
  let repository;

  beforeEach(() => {
    adapter = new MockApiAdapter();
    repository = new AlbumRepository(adapter);
  });

  afterEach(() => {
    adapter.reset();
  });

  describe('getAllAlbums', () => {
    it('should return all albums sorted by date descending', async () => {
      const mockAlbums = [
        { id: '1', title: 'Album 1', date: '2024-01-01' },
        { id: '2', title: 'Album 2', date: '2024-03-01' },
        { id: '3', title: 'Album 3', date: '2024-02-01' }
      ];

      adapter.setMockData('listAlbums', {
        listAlbums: { items: mockAlbums }
      });

      const albums = await repository.getAllAlbums();

      expect(albums).toHaveLength(3);
      expect(albums[0].id).toBe('2'); // Most recent first
      expect(albums[1].id).toBe('3');
      expect(albums[2].id).toBe('1'); // Oldest last
    });

    it('should handle empty album list', async () => {
      adapter.setMockData('listAlbums', {
        listAlbums: { items: [] }
      });

      const albums = await repository.getAllAlbums();
      expect(albums).toEqual([]);
    });
  });

  describe('getAlbumById', () => {
    it('should return album by ID', async () => {
      const mockAlbum = { id: '123', title: 'Test Album' };
      adapter.setMockData('getAlbums', {
        getAlbums: mockAlbum
      });

      const album = await repository.getAlbumById('123');
      expect(album).toEqual(mockAlbum);
    });
  });

  describe('getAlbumByUrl', () => {
    it('should return album by URL', async () => {
      const mockAlbum = { id: '123', title: 'Test Album' };
      adapter.setMockData('getUrl', {
        getUrl: { album: mockAlbum }
      });

      const album = await repository.getAlbumByUrl('test-album-23');
      expect(album).toEqual(mockAlbum);
    });

    it('should decode URL before querying', async () => {
      const mockAlbum = { id: '123', title: 'Test Album' };
      adapter.setMockData('getUrl', {
        getUrl: { album: mockAlbum }
      });

      const album = await repository.getAlbumByUrl('test%20album-23');
      expect(album).toEqual(mockAlbum);
    });

    it('should return null when album not found', async () => {
      adapter.setMockData('getUrl', {
        getUrl: null
      });

      const album = await repository.getAlbumByUrl('nonexistent-99');
      expect(album).toBeNull();
    });
  });

  describe('getPublicAlbums', () => {
    it('should filter and return only public albums', async () => {
      const mockAlbums = [
        { id: '1', title: 'Public 1', privacy: 'public', date: '2024-01-01' },
        { id: '2', title: 'Private 1', privacy: 'private', date: '2024-02-01' },
        { id: '3', title: 'Public 2', privacy: 'public', date: '2024-03-01' }
      ];

      adapter.setMockData('listAlbums', {
        listAlbums: { items: mockAlbums }
      });

      const albums = await repository.getPublicAlbums();

      expect(albums).toHaveLength(2);
      expect(albums.every(a => a.privacy === 'public')).toBe(true);
    });
  });

  describe('getFeaturedAlbums', () => {
    it('should filter and return only featured albums', async () => {
      const mockAlbums = [
        { id: '1', title: 'Album 1', featured: true, date: '2024-01-01' },
        { id: '2', title: 'Album 2', featured: false, date: '2024-02-01' },
        { id: '3', title: 'Album 3', featured: true, date: '2024-03-01' }
      ];

      adapter.setMockData('listAlbums', {
        listAlbums: { items: mockAlbums }
      });

      const albums = await repository.getFeaturedAlbums();

      expect(albums).toHaveLength(2);
      expect(albums.every(a => a.featured === true)).toBe(true);
    });
  });

  describe('getAlbumTags', () => {
    it('should return all album tags', async () => {
      const mockTags = [
        { id: '1', title: 'Nature' },
        { id: '2', title: 'Wildlife' }
      ];

      adapter.setMockData('listAlbumTags', {
        listAlbumTags: { items: mockTags }
      });

      const tags = await repository.getAlbumTags();
      expect(tags).toEqual(mockTags);
    });
  });

  describe('getPublicAlbumTags', () => {
    it('should return public album tags', async () => {
      const mockTags = [
        { id: '1', title: 'Nature', privacy: 'public' }
      ];

      adapter.setMockData('listAlbumTags', {
        listAlbumTags: { items: mockTags }
      });

      const tags = await repository.getPublicAlbumTags();
      expect(tags).toEqual(mockTags);
    });
  });

  describe('createAlbum', () => {
    it('should create a new album', async () => {
      const albumData = { title: 'New Album', desc: 'Test description' };
      const createdAlbum = { id: '123', ...albumData };

      adapter.setMockData('createAlbums', {
        createAlbums: createdAlbum
      });

      const result = await repository.createAlbum(albumData);

      expect(result).toEqual(createdAlbum);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0].options.authMode).toBe('userPool');
    });
  });

  describe('updateAlbum', () => {
    it('should update an existing album', async () => {
      const updates = { title: 'Updated Title' };
      const updatedAlbum = { id: '123', ...updates };

      adapter.setMockData('updateAlbums', {
        updateAlbums: updatedAlbum
      });

      const result = await repository.updateAlbum('123', updates);

      expect(result).toEqual(updatedAlbum);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0].options.authMode).toBe('userPool');
    });
  });

  describe('deleteAlbum', () => {
    it('should delete an album', async () => {
      const deletedAlbum = { id: '123', title: 'Deleted Album' };

      adapter.setMockData('deleteAlbums', {
        deleteAlbums: deletedAlbum
      });

      const result = await repository.deleteAlbum('123');

      expect(result).toEqual(deletedAlbum);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0].options.authMode).toBe('userPool');
    });
  });

  describe('generateAlbumUrl', () => {
    it('should generate URL from album title and ID', () => {
      const album = { id: 'abc123', title: 'Killer Whales' };
      const url = repository.generateAlbumUrl(album);
      expect(url).toBe('killer-whales-23');
    });

    it('should handle multi-word titles', () => {
      const album = { id: 'xyz789', title: 'Beautiful Sunset Photos' };
      const url = repository.generateAlbumUrl(album);
      expect(url).toBe('beautiful-sunset-photos-89');
    });

    it('should convert to lowercase', () => {
      const album = { id: 'abc456', title: 'NATURE' };
      const url = repository.generateAlbumUrl(album);
      expect(url).toBe('nature-56');
    });
  });

  describe('generateAlbumUrlSafe', () => {
    it('should generate URL-encoded version', () => {
      const album = { id: 'abc123', title: 'Test Album' };
      const url = repository.generateAlbumUrlSafe(album);
      expect(url).toBe(encodeURIComponent('test-album-23'));
    });
  });

  describe('tag operations', () => {
    it('should create album tag', async () => {
      const tagData = { title: 'Nature', privacy: 'public' };
      const createdTag = { id: '123', ...tagData };

      adapter.setMockData('createAlbumTags', {
        createAlbumTags: createdTag
      });

      const result = await repository.createAlbumTag(tagData);
      expect(result).toEqual(createdTag);
    });

    it('should update album tag', async () => {
      const updates = { title: 'Wildlife' };
      const updatedTag = { id: '123', ...updates };

      adapter.setMockData('updateAlbumTags', {
        updateAlbumTags: updatedTag
      });

      const result = await repository.updateAlbumTag('123', updates);
      expect(result).toEqual(updatedTag);
    });

    it('should delete album tag', async () => {
      const deletedTag = { id: '123', title: 'Nature' };

      adapter.setMockData('deleteAlbumTags', {
        deleteAlbumTags: deletedTag
      });

      const result = await repository.deleteAlbumTag('123');
      expect(result).toEqual(deletedTag);
    });
  });
});
