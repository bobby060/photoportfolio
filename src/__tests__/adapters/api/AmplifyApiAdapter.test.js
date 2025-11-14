import { AmplifyApiAdapter } from '../../../adapters/api/AmplifyApiAdapter';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

// Mock AWS Amplify functions
jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn()
}));

jest.mock('aws-amplify/storage', () => ({
  uploadData: jest.fn(),
  getUrl: jest.fn(),
  remove: jest.fn()
}));

describe('AmplifyApiAdapter', () => {
  let adapter;
  let mockPublicClient;
  let mockAuthenticatedClient;

  beforeEach(() => {
    // Clear mocks first
    jest.clearAllMocks();

    // Create mock clients
    mockPublicClient = {
      graphql: jest.fn()
    };
    mockAuthenticatedClient = {
      graphql: jest.fn()
    };

    // Mock generateClient to return different clients
    generateClient.mockImplementation(({ authMode }) => {
      return authMode === 'apiKey' ? mockPublicClient : mockAuthenticatedClient;
    });

    adapter = new AmplifyApiAdapter();
  });

  describe('constructor', () => {
    it('should create public and authenticated clients', () => {
      expect(generateClient).toHaveBeenCalledWith({ authMode: 'apiKey' });
      expect(generateClient).toHaveBeenCalledWith({ authMode: 'userPool' });
      expect(adapter.publicClient).toBe(mockPublicClient);
      expect(adapter.authenticatedClient).toBe(mockAuthenticatedClient);
    });
  });

  describe('query', () => {
    it('should execute query with public client by default', async () => {
      const mockData = { albums: [{ id: '1', title: 'Test' }] };
      mockPublicClient.graphql.mockResolvedValue({ data: mockData });

      const query = 'query GetAlbums { albums }';
      const result = await adapter.query(query);

      expect(result).toEqual(mockData);
      expect(mockPublicClient.graphql).toHaveBeenCalledWith({
        query,
        variables: {}
      });
    });

    it('should execute query with authenticated client when specified', async () => {
      const mockData = { userAlbums: [] };
      mockAuthenticatedClient.graphql.mockResolvedValue({ data: mockData });

      const query = 'query GetUserAlbums { userAlbums }';
      const result = await adapter.query(query, { authMode: 'userPool' });

      expect(result).toEqual(mockData);
      expect(mockAuthenticatedClient.graphql).toHaveBeenCalledWith({
        query,
        variables: {}
      });
    });

    it('should pass variables to query', async () => {
      const mockData = { album: { id: '1' } };
      mockPublicClient.graphql.mockResolvedValue({ data: mockData });

      const query = 'query GetAlbum($id: ID!) { album(id: $id) }';
      const variables = { id: '123' };
      await adapter.query(query, { variables });

      expect(mockPublicClient.graphql).toHaveBeenCalledWith({
        query,
        variables
      });
    });

    it('should handle query errors', async () => {
      const error = new Error('GraphQL error');
      error.code = 'GRAPHQL_ERROR';
      mockPublicClient.graphql.mockRejectedValue(error);

      await expect(adapter.query('query { test }')).rejects.toThrow('GraphQL error');
    });

    it('should transform GraphQL errors array', async () => {
      const error = {
        errors: [
          { message: 'Error 1' },
          { message: 'Error 2' }
        ]
      };
      mockPublicClient.graphql.mockRejectedValue(error);

      await expect(adapter.query('query { test }'))
        .rejects.toThrow('Error 1, Error 2');
    });
  });

  describe('mutate', () => {
    it('should execute mutation with authenticated client by default', async () => {
      const mockData = { createAlbum: { id: '1', title: 'New Album' } };
      mockAuthenticatedClient.graphql.mockResolvedValue({ data: mockData });

      const mutation = 'mutation CreateAlbum($input: CreateAlbumInput!) { createAlbum(input: $input) }';
      const variables = { input: { title: 'New Album' } };
      const result = await adapter.mutate(mutation, { variables });

      expect(result).toEqual(mockData);
      expect(mockAuthenticatedClient.graphql).toHaveBeenCalledWith({
        query: mutation,
        variables
      });
    });

    it('should execute mutation with public client when specified', async () => {
      const mockData = { publicAction: { success: true } };
      mockPublicClient.graphql.mockResolvedValue({ data: mockData });

      const mutation = 'mutation PublicAction { publicAction }';
      const result = await adapter.mutate(mutation, { authMode: 'apiKey' });

      expect(result).toEqual(mockData);
      expect(mockPublicClient.graphql).toHaveBeenCalledWith({
        query: mutation,
        variables: {}
      });
    });

    it('should handle mutation errors', async () => {
      const error = new Error('Mutation failed');
      error.code = 'UNAUTHORIZED';
      mockAuthenticatedClient.graphql.mockRejectedValue(error);

      await expect(adapter.mutate('mutation { test }')).rejects.toThrow('Mutation failed');
    });
  });

  describe('uploadFile', () => {
    it('should upload file to S3', async () => {
      const mockFile = new Blob(['test content'], { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'type', { value: 'image/jpeg' });

      const mockUploadTask = {
        result: Promise.resolve({ key: 'images/test.jpg' })
      };
      uploadData.mockReturnValue(mockUploadTask);

      const result = await adapter.uploadFile('images/test.jpg', mockFile);

      expect(result).toEqual({ key: 'images/test.jpg' });
      expect(uploadData).toHaveBeenCalledWith({
        key: 'images/test.jpg',
        data: mockFile,
        options: {
          contentType: 'image/jpeg'
        }
      });
    });

    it('should attach progress listener when provided', async () => {
      const mockFile = new Blob(['test'], { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'type', { value: 'image/jpeg' });

      const mockUploadTask = {
        result: Promise.resolve({ key: 'test.jpg' }),
        onProgress: null
      };
      uploadData.mockReturnValue(mockUploadTask);

      const onProgress = jest.fn();
      await adapter.uploadFile('test.jpg', mockFile, { onProgress });

      // Simulate progress callback
      mockUploadTask.onProgress({ transferredBytes: 50, totalBytes: 100 });

      expect(onProgress).toHaveBeenCalledWith({
        loaded: 50,
        total: 100
      });
    });

    it('should pass additional upload options', async () => {
      const mockFile = new Blob(['test'], { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'type', { value: 'image/jpeg' });

      const mockUploadTask = {
        result: Promise.resolve({ key: 'test.jpg' })
      };
      uploadData.mockReturnValue(mockUploadTask);

      await adapter.uploadFile('test.jpg', mockFile, {
        metadata: { custom: 'value' },
        acl: 'public-read'
      });

      expect(uploadData).toHaveBeenCalledWith({
        key: 'test.jpg',
        data: mockFile,
        options: {
          contentType: 'image/jpeg',
          metadata: { custom: 'value' },
          acl: 'public-read'
        }
      });
    });

    it('should handle upload errors', async () => {
      const mockFile = new Blob(['test'], { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'type', { value: 'image/jpeg' });

      const mockUploadTask = {
        result: Promise.reject(new Error('Upload failed'))
      };
      uploadData.mockReturnValue(mockUploadTask);

      await expect(adapter.uploadFile('test.jpg', mockFile))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('getFileUrl', () => {
    it('should return signed URL for file', async () => {
      const mockUrl = {
        url: { toString: () => 'https://s3.amazonaws.com/bucket/images/test.jpg' }
      };
      getUrl.mockResolvedValue(mockUrl);

      const url = await adapter.getFileUrl('images/test.jpg');

      expect(url).toBe('https://s3.amazonaws.com/bucket/images/test.jpg');
      expect(getUrl).toHaveBeenCalledWith({ key: 'images/test.jpg' });
    });

    it('should handle getUrl errors', async () => {
      getUrl.mockRejectedValue(new Error('File not found'));

      await expect(adapter.getFileUrl('nonexistent.jpg'))
        .rejects.toThrow('File not found');
    });
  });

  describe('deleteFile', () => {
    it('should delete file from S3', async () => {
      remove.mockResolvedValue();

      await adapter.deleteFile('images/test.jpg');

      expect(remove).toHaveBeenCalledWith({ key: 'images/test.jpg' });
    });

    it('should handle deletion errors', async () => {
      remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(adapter.deleteFile('test.jpg'))
        .rejects.toThrow('Deletion failed');
    });
  });

  describe('_transformError', () => {
    it('should transform basic error', () => {
      const error = new Error('Test error');
      error.code = 'TEST_CODE';

      const transformed = adapter._transformError(error);

      expect(transformed.message).toBe('Test error');
      expect(transformed.code).toBe('TEST_CODE');
      expect(transformed.originalError).toBe(error);
    });

    it('should use error name as code if code is missing', () => {
      const error = new Error('Test error');
      error.name = 'CustomError';

      const transformed = adapter._transformError(error);

      expect(transformed.code).toBe('CustomError');
    });

    it('should default to UNKNOWN_ERROR if no code or name', () => {
      // Use plain object to ensure no inherited name property
      const error = { message: 'Test error' };

      const transformed = adapter._transformError(error);

      expect(transformed.code).toBe('UNKNOWN_ERROR');
    });

    it('should extract GraphQL errors array', () => {
      const error = {
        message: 'Original message',
        errors: [
          { message: 'Validation error 1' },
          { message: 'Validation error 2' }
        ]
      };

      const transformed = adapter._transformError(error);

      expect(transformed.message).toBe('Validation error 1, Validation error 2');
      expect(transformed.details).toEqual(error.errors);
    });

    it('should handle error with no message', () => {
      const error = {};

      const transformed = adapter._transformError(error);

      expect(transformed.message).toBe('An error occurred');
      expect(transformed.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete album creation flow', async () => {
      const mockData = { createAlbums: { id: '123', title: 'New Album' } };
      mockAuthenticatedClient.graphql.mockResolvedValue({ data: mockData });

      const mutation = 'mutation CreateAlbums($input: CreateAlbumsInput!) { createAlbums(input: $input) }';
      const variables = {
        input: {
          title: 'New Album',
          privacy: 'public'
        }
      };

      const result = await adapter.mutate(mutation, { variables });

      expect(result).toEqual(mockData);
      expect(mockAuthenticatedClient.graphql).toHaveBeenCalled();
    });

    it('should handle image upload with progress tracking', async () => {
      const file = new Blob(['image data'], { type: 'image/png' });
      Object.defineProperty(file, 'type', { value: 'image/png' });

      let progressCallback;
      const mockUploadTask = {
        result: Promise.resolve({ key: 'images/photo.png' }),
        onProgress: null
      };

      uploadData.mockImplementation(() => {
        // Simulate async progress updates
        setTimeout(() => {
          if (mockUploadTask.onProgress) {
            mockUploadTask.onProgress({ transferredBytes: 500, totalBytes: 1000 });
          }
        }, 10);
        return mockUploadTask;
      });

      const onProgress = jest.fn();
      const resultPromise = adapter.uploadFile('images/photo.png', file, { onProgress });

      // Wait for upload to complete
      const result = await resultPromise;

      expect(result.key).toBe('images/photo.png');
    });
  });
});
