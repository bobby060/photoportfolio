import { ImageRepository } from '../../repositories/ImageRepository';
import { MockApiAdapter } from '../../adapters/api/MockApiAdapter';

describe('ImageRepository', () => {
  let adapter;
  let repository;

  beforeEach(() => {
    adapter = new MockApiAdapter();
    repository = new ImageRepository(adapter);
  });

  afterEach(() => {
    adapter.reset();
  });

  const createMockFile = (name = 'test.jpg', size = 1024) => {
    const file = new Blob(['test content'], { type: 'image/jpeg' });
    file.name = name;
    file.size = size;
    return file;
  };

  describe('uploadImage', () => {
    it('should upload a single image', async () => {
      const file = createMockFile('photo.jpg');
      const imageRecord = { id: '123', title: 'photo.jpg', albumsID: 'album1' };

      adapter.setMockData('createImages', {
        createImages: imageRecord
      });

      const result = await repository.uploadImage('album1', file);

      expect(result).toEqual(imageRecord);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.uploads).toHaveLength(1);
      expect(history.uploads[0].key).toBe('images/123');
    });

    it('should use custom metadata when provided', async () => {
      const file = createMockFile('photo.jpg');
      const metadata = {
        title: 'Custom Title',
        desc: 'Custom Description',
        index: 5,
        width: 1920,
        height: 1080
      };

      const imageRecord = { id: '123', ...metadata, albumsID: 'album1' };
      adapter.setMockData('createImages', {
        createImages: imageRecord
      });

      const result = await repository.uploadImage('album1', file, metadata);

      expect(result.title).toBe('Custom Title');
      expect(result.desc).toBe('Custom Description');
    });

    it('should handle upload errors', async () => {
      const file = createMockFile();
      const error = new Error('Upload failed');

      adapter.setMockError('createImages', error);

      await expect(repository.uploadImage('album1', file)).rejects.toThrow('Upload failed');
    });
  });

  describe('uploadMultipleImages', () => {
    it('should upload multiple images successfully', async () => {
      const files = [
        createMockFile('photo1.jpg'),
        createMockFile('photo2.jpg'),
        createMockFile('photo3.jpg')
      ];

      adapter.setMockData('createImages', {
        createImages: { id: '123', albumsID: 'album1' }
      });

      const onProgress = jest.fn();
      const results = await repository.uploadMultipleImages('album1', files, onProgress);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenLastCalledWith(3, 3);
    });

    it('should handle partial failures', async () => {
      const files = [
        createMockFile('photo1.jpg'),
        createMockFile('photo2.jpg')
      ];

      let callCount = 0;
      adapter.setMockData('createImages', {
        createImages: { id: '123', albumsID: 'album1' }
      });

      // Override mutate to fail on second call
      const originalMutate = adapter.mutate.bind(adapter);
      adapter.mutate = jest.fn(async (...args) => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Upload failed');
        }
        return originalMutate(...args);
      });

      const results = await repository.uploadMultipleImages('album1', files);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBe('Upload failed');
    });

    it('should call progress callback correctly', async () => {
      const files = [createMockFile('photo1.jpg'), createMockFile('photo2.jpg')];

      adapter.setMockData('createImages', {
        createImages: { id: '123', albumsID: 'album1' }
      });

      const onProgress = jest.fn();
      await repository.uploadMultipleImages('album1', files, onProgress);

      expect(onProgress).toHaveBeenCalledWith(1, 2);
      expect(onProgress).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('uploadImagesWithRollback', () => {
    it('should upload all images successfully', async () => {
      const files = [createMockFile('photo1.jpg'), createMockFile('photo2.jpg')];

      adapter.setMockData('createImages', {
        createImages: { id: '123', albumsID: 'album1' }
      });

      const results = await repository.uploadImagesWithRollback('album1', files);

      expect(results).toHaveLength(2);
    });

    it('should rollback on failure', async () => {
      const files = [createMockFile('photo1.jpg'), createMockFile('photo2.jpg')];

      let callCount = 0;
      adapter.setMockData('createImages', {
        createImages: { id: `img-${++callCount}`, albumsID: 'album1' }
      });

      // Override to fail on second upload
      const originalMutate = adapter.mutate.bind(adapter);
      let mutateCallCount = 0;
      adapter.mutate = jest.fn(async (mutation, options) => {
        mutateCallCount++;
        // Fail on second createImages call (not delete calls)
        if (mutation.includes('createImages') && mutateCallCount === 2) {
          throw new Error('Upload failed');
        }
        return originalMutate(mutation, options);
      });

      await expect(repository.uploadImagesWithRollback('album1', files)).rejects.toThrow('Upload failed');

      const history = adapter.getCallHistory();
      // Should have delete mutations for rollback
      const deleteCalls = history.mutations.filter(m => m.mutation.includes('deleteImages'));
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
  });

  describe('updateImage', () => {
    it('should update image metadata', async () => {
      const updates = { title: 'Updated Title', desc: 'Updated Description' };
      const updatedImage = { id: '123', ...updates };

      adapter.setMockData('updateImages', {
        updateImages: updatedImage
      });

      const result = await repository.updateImage('123', updates);

      expect(result).toEqual(updatedImage);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0].options.authMode).toBe('userPool');
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      const deletedImage = { id: '123', title: 'Deleted Image' };

      adapter.setMockData('deleteImages', {
        deleteImages: deletedImage
      });

      const result = await repository.deleteImage('123');

      expect(result).toEqual(deletedImage);
    });
  });

  describe('deleteMultipleImages', () => {
    it('should delete multiple images', async () => {
      const imageIds = ['123', '456', '789'];

      adapter.setMockData('deleteImages', {
        deleteImages: { id: 'deleted' }
      });

      const results = await repository.deleteMultipleImages(imageIds);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle partial deletion failures', async () => {
      const imageIds = ['123', '456'];

      let callCount = 0;
      adapter.mutate = jest.fn(async () => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Delete failed');
        }
        return { deleteImages: { id: 'deleted' } };
      });

      const results = await repository.deleteMultipleImages(imageIds);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });
  });

  describe('reorderImages', () => {
    it('should reorder images', async () => {
      const imageOrders = [
        { id: '123', index: 0 },
        { id: '456', index: 1 },
        { id: '789', index: 2 }
      ];

      adapter.setMockData('updateImages', {
        updateImages: { id: 'updated' }
      });

      const results = await repository.reorderImages(imageOrders);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(3);
    });
  });

  describe('setFeaturedImage', () => {
    it('should set featured image for album', async () => {
      const updatedAlbum = {
        id: 'album1',
        albumsFeaturedImageId: 'img123'
      };

      adapter.setMockData('updateAlbums', {
        updateAlbums: updatedAlbum
      });

      const result = await repository.setFeaturedImage('album1', 'img123');

      expect(result).toEqual(updatedAlbum);

      const history = adapter.getCallHistory();
      expect(history.mutations).toHaveLength(1);
      expect(history.mutations[0].options.variables.input).toEqual({
        id: 'album1',
        albumsFeaturedImageId: 'img123'
      });
    });
  });
});
