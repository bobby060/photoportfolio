import { MockApiAdapter } from '../../../adapters/api/MockApiAdapter';

describe('MockApiAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MockApiAdapter();
  });

  describe('query', () => {
    it('should return empty object when no mock data is set', async () => {
      const result = await adapter.query('query GetAlbums { albums }');
      expect(result).toEqual({});
    });

    it('should return mock data when set', async () => {
      const mockData = { albums: [{ id: '1', title: 'Test Album' }] };
      adapter.setMockData('GetAlbums', mockData);

      const result = await adapter.query('query GetAlbums { albums }');
      expect(result).toEqual(mockData);
    });

    it('should throw mock error when set', async () => {
      const mockError = new Error('Test error');
      adapter.setMockError('GetAlbums', mockError);

      await expect(adapter.query('query GetAlbums { albums }')).rejects.toThrow('Test error');
    });

    it('should record query call in history', async () => {
      const query = 'query GetAlbums { albums }';
      const options = { variables: { id: '123' } };

      await adapter.query(query, options);

      const history = adapter.getCallHistory();
      expect(history.queries).toHaveLength(1);
      expect(history.queries[0]).toEqual({ query, options });
    });
  });

  describe('mutate', () => {
    it('should return empty object when no mock data is set', async () => {
      const result = await adapter.mutate('mutation CreateAlbum { createAlbum }');
      expect(result).toEqual({});
    });

    it('should return mock data when set', async () => {
      const mockData = { createAlbum: { id: '1', title: 'New Album' } };
      adapter.setMockData('CreateAlbum', mockData);

      const result = await adapter.mutate('mutation CreateAlbum { createAlbum }');
      expect(result).toEqual(mockData);
    });

    it('should return input data for create mutations', async () => {
      const input = { title: 'New Album', desc: 'Description' };
      const result = await adapter.mutate('mutation createAlbums { createAlbums }', {
        variables: { input }
      });

      expect(result.createAlbums).toBeDefined();
      expect(result.createAlbums.title).toBe('New Album');
      expect(result.createAlbums.desc).toBe('Description');
      expect(result.createAlbums.id).toBeDefined();
    });

    it('should throw mock error when set', async () => {
      const mockError = new Error('Create failed');
      adapter.setMockError('CreateAlbum', mockError);

      await expect(adapter.mutate('mutation CreateAlbum { createAlbum }')).rejects.toThrow('Create failed');
    });

    it('should record mutation call in history', async () => {
      const mutation = 'mutation CreateAlbum { createAlbum }';
      const options = { variables: { input: { title: 'Test' } } };

      await adapter.mutate(mutation, options);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0]).toEqual({ mutation, options });
    });
  });

  describe('uploadFile', () => {
    it('should store file reference', async () => {
      const file = new Blob(['test content'], { type: 'image/jpeg' });
      file.size = 12;

      const result = await adapter.uploadFile('images/test.jpg', file);

      expect(result).toEqual({ key: 'images/test.jpg' });
      expect(adapter.mockFiles.has('images/test.jpg')).toBe(true);
    });

    it('should call onProgress callback', async () => {
      const file = new Blob(['test content'], { type: 'image/jpeg' });
      file.size = 12;
      const onProgress = jest.fn();

      await adapter.uploadFile('images/test.jpg', file, { onProgress });

      expect(onProgress).toHaveBeenCalledWith({
        loaded: file.size,
        total: file.size
      });
    });

    it('should record upload call in history', async () => {
      const file = new Blob(['test content'], { type: 'image/jpeg' });
      file.size = 12;

      await adapter.uploadFile('images/test.jpg', file);

      const history = adapter.getCallHistory();
      expect(history.uploads).toHaveLength(1);
      expect(history.uploads[0].key).toBe('images/test.jpg');
      expect(history.uploads[0].file).toBe(file);
    });
  });

  describe('getFileUrl', () => {
    it('should return mock URL for uploaded file', async () => {
      const file = new Blob(['test content'], { type: 'image/jpeg' });
      file.size = 12;
      await adapter.uploadFile('images/test.jpg', file);

      const url = await adapter.getFileUrl('images/test.jpg');
      expect(url).toBe('mock://storage/images/test.jpg');
    });

    it('should throw error for non-existent file', async () => {
      await expect(adapter.getFileUrl('nonexistent.jpg')).rejects.toThrow('File not found');
    });
  });

  describe('reset', () => {
    it('should clear all mock data and history', async () => {
      adapter.setMockData('GetAlbums', { albums: [] });
      await adapter.query('query GetAlbums { albums }');
      await adapter.mutate('mutation CreateAlbum { createAlbum }');

      const file = new Blob(['test'], { type: 'image/jpeg' });
      file.size = 4;
      await adapter.uploadFile('test.jpg', file);

      adapter.reset();

      expect(adapter.mockData.size).toBe(0);
      expect(adapter.mockFiles.size).toBe(0);
      expect(adapter.getCallHistory().queries).toHaveLength(0);
      expect(adapter.getCallHistory().mutations).toHaveLength(0);
      expect(adapter.getCallHistory().uploads).toHaveLength(0);
    });
  });

  describe('createMockAlbum', () => {
    it('should create mock album with default values', () => {
      const album = MockApiAdapter.createMockAlbum();

      expect(album.id).toBeDefined();
      expect(album.title).toBe('Mock Album');
      expect(album.description).toBe('Mock album description');
      expect(album.privacy).toBe('public');
      expect(album.featured).toBe(false);
    });

    it('should allow overriding default values', () => {
      const album = MockApiAdapter.createMockAlbum({
        title: 'Custom Album',
        privacy: 'private',
        featured: true
      });

      expect(album.title).toBe('Custom Album');
      expect(album.privacy).toBe('private');
      expect(album.featured).toBe(true);
    });
  });

  describe('createMockImage', () => {
    it('should create mock image with default values', () => {
      const image = MockApiAdapter.createMockImage();

      expect(image.id).toBeDefined();
      expect(image.name).toBe('mock-image.jpg');
      expect(image.description).toBe('Mock image');
      expect(image.albumID).toBe('mock-album-id');
    });

    it('should allow overriding default values', () => {
      const image = MockApiAdapter.createMockImage({
        name: 'custom.jpg',
        albumID: 'custom-album-id'
      });

      expect(image.name).toBe('custom.jpg');
      expect(image.albumID).toBe('custom-album-id');
    });
  });
});
