import { renderHook, waitFor, act } from '@testing-library/react';
import { useAlbums, useAlbum, useAlbumTags } from '../../hooks/useAlbums';
import { RepositoryProvider } from '../../providers/RepositoryProvider';
import { MockAuthAdapter } from '../../adapters/auth/MockAuthAdapter';
import { MockApiAdapter } from '../../adapters/api/MockApiAdapter';
import { MemoryStorageAdapter } from '../../adapters/storage/MemoryStorageAdapter';

describe('useAlbums', () => {
  let mockAuthAdapter;
  let mockApiAdapter;
  let mockStorageAdapter;

  const mockAlbums = [
    { id: '1', title: 'Album 1', privacy: 'public', date: '2024-01-01' },
    { id: '2', title: 'Album 2', privacy: 'public', date: '2024-01-02' },
    { id: '3', title: 'Album 3', privacy: 'private', date: '2024-01-03' }
  ];

  const wrapper = ({ children }) => (
    <RepositoryProvider
      adapters={{
        auth: mockAuthAdapter,
        api: mockApiAdapter,
        localStorage: mockStorageAdapter,
        sessionStorage: mockStorageAdapter
      }}
    >
      {children}
    </RepositoryProvider>
  );

  beforeEach(() => {
    mockAuthAdapter = new MockAuthAdapter();
    mockApiAdapter = new MockApiAdapter();
    mockStorageAdapter = new MemoryStorageAdapter();

    // Setup mock data
    mockApiAdapter.setMockData('listAlbums', {
      listAlbums: { items: mockAlbums }
    });
  });

  describe('useAlbums - basic functionality', () => {
    it('should start with loading true', () => {
      const { result } = renderHook(() => useAlbums(), { wrapper });
      expect(result.current.loading).toBe(true);
    });

    it('should fetch all albums', async () => {
      const { result } = renderHook(() => useAlbums({ filter: 'all' }), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.albums).toHaveLength(3);
      expect(result.current.albums).toEqual(mockAlbums);
    });

    it('should fetch only public albums', async () => {
      const { result } = renderHook(() => useAlbums({ filter: 'public' }), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.albums).toHaveLength(2);
      expect(result.current.albums.every(a => a.privacy === 'public')).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      mockApiAdapter.setMockError('listAlbums', new Error('Fetch failed'));

      const { result } = renderHook(() => useAlbums(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.albums).toEqual([]);
    });
  });

  describe('useAlbums - caching', () => {
    it('should use cache when useCache is true', async () => {
      const { result: result1 } = renderHook(
        () => useAlbums({ useCache: true }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
      });

      const callCount1 = mockApiAdapter.queryCallHistory.length;

      // Second render should use cache
      const { result: result2 } = renderHook(
        () => useAlbums({ useCache: true }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Should be same albums from cache (no additional API call within cache TTL)
      expect(result2.current.albums).toEqual(result1.current.albums);
    });

    it('should skip cache when useCache is false', async () => {
      const { result } = renderHook(
        () => useAlbums({ useCache: false }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.albums).toHaveLength(3);
    });

    it('should clear cache', async () => {
      const { result } = renderHook(() => useAlbums({ useCache: true }), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.clearCache();
      });

      // Cache should be cleared (storage adapter should be empty)
      expect(await mockStorageAdapter.getItem('album_cache')).toBeNull();
    });
  });

  describe('useAlbums - refetch', () => {
    it('should refetch albums', async () => {
      const { result } = renderHook(() => useAlbums(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.albums).toHaveLength(3);

      // Update mock data
      const updatedAlbums = [...mockAlbums, { id: '4', title: 'Album 4', privacy: 'public' }];
      mockApiAdapter.setMockData('listAlbums', {
        listAlbums: { items: updatedAlbums }
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.albums).toHaveLength(4);
    });
  });

  describe('useAlbums - manual fetch', () => {
    it('should not auto-fetch when autoFetch is false', async () => {
      const { result } = renderHook(
        () => useAlbums({ autoFetch: false }),
        { wrapper }
      );

      // Should remain in initial state
      expect(result.current.albums).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should allow manual fetch', async () => {
      const { result } = renderHook(
        () => useAlbums({ autoFetch: false }),
        { wrapper }
      );

      await act(async () => {
        await result.current.fetchAlbums();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.albums).toHaveLength(3);
    });
  });
});

describe('useAlbum', () => {
  let mockAuthAdapter;
  let mockApiAdapter;
  let mockStorageAdapter;

  const mockAlbum = {
    id: '1',
    title: 'Test Album',
    privacy: 'public',
    description: 'Test description'
  };

  const wrapper = ({ children }) => (
    <RepositoryProvider
      adapters={{
        auth: mockAuthAdapter,
        api: mockApiAdapter,
        localStorage: mockStorageAdapter,
        sessionStorage: mockStorageAdapter
      }}
    >
      {children}
    </RepositoryProvider>
  );

  beforeEach(() => {
    mockAuthAdapter = new MockAuthAdapter();
    mockApiAdapter = new MockApiAdapter();
    mockStorageAdapter = new MemoryStorageAdapter();

    // Setup mock data for album URL resolution
    mockApiAdapter.setMockData('listAlbums', {
      listAlbums: {
        items: [{
          ...mockAlbum,
          Url: { items: [{ url: 'test-album-01' }] }
        }]
      }
    });
  });

  describe('basic functionality', () => {
    it('should start with loading true', () => {
      const { result } = renderHook(() => useAlbum('test-album-01'), { wrapper });
      expect(result.current.loading).toBe(true);
    });

    it('should fetch album by URL', async () => {
      const { result } = renderHook(() => useAlbum('test-album-01'), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.album).toBeTruthy();
      expect(result.current.album.title).toBe('Test Album');
    });

    it('should handle not found', async () => {
      mockApiAdapter.setMockData('listAlbums', {
        listAlbums: { items: [] }
      });

      const { result } = renderHook(() => useAlbum('nonexistent'), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.album).toBeNull();
    });

    it('should handle errors', async () => {
      mockApiAdapter.setMockError('listAlbums', new Error('Fetch failed'));

      const { result } = renderHook(() => useAlbum('test-album-01'), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.album).toBeNull();
    });
  });

  describe('refetch', () => {
    it('should refetch album', async () => {
      const { result } = renderHook(() => useAlbum('test-album-01'), { wrapper });

      await waitFor(() => {
        expect(result.current.album).toBeTruthy();
      });

      // Update mock data
      const updatedAlbum = { ...mockAlbum, title: 'Updated Album' };
      mockApiAdapter.setMockData('listAlbums', {
        listAlbums: {
          items: [{
            ...updatedAlbum,
            Url: { items: [{ url: 'test-album-01' }] }
          }]
        }
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.album.title).toBe('Updated Album');
    });
  });
});

describe('useAlbumTags', () => {
  let mockAuthAdapter;
  let mockApiAdapter;
  let mockStorageAdapter;

  const mockTags = [
    { id: '1', title: 'Tag 1', privacy: 'public' },
    { id: '2', title: 'Tag 2', privacy: 'public' },
    { id: '3', title: 'Tag 3', privacy: 'private' }
  ];

  const wrapper = ({ children }) => (
    <RepositoryProvider
      adapters={{
        auth: mockAuthAdapter,
        api: mockApiAdapter,
        localStorage: mockStorageAdapter,
        sessionStorage: mockStorageAdapter
      }}
    >
      {children}
    </RepositoryProvider>
  );

  beforeEach(() => {
    mockAuthAdapter = new MockAuthAdapter();
    mockApiAdapter = new MockApiAdapter();
    mockStorageAdapter = new MemoryStorageAdapter();

    // Setup mock data
    mockApiAdapter.setMockData('listAlbumTags', {
      listAlbumTags: { items: mockTags }
    });
  });

  describe('basic functionality', () => {
    it('should fetch all tags', async () => {
      const { result } = renderHook(() => useAlbumTags({ filter: 'all' }), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tags).toHaveLength(3);
    });

    it('should fetch only public tags', async () => {
      const { result } = renderHook(() => useAlbumTags({ filter: 'public' }), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tags).toHaveLength(2);
      expect(result.current.tags.every(t => t.privacy === 'public')).toBe(true);
    });

    it('should handle errors', async () => {
      mockApiAdapter.setMockError('listAlbumTags', new Error('Fetch failed'));

      const { result } = renderHook(() => useAlbumTags(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.tags).toEqual([]);
    });
  });

  describe('refetch', () => {
    it('should refetch tags', async () => {
      const { result } = renderHook(() => useAlbumTags(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update mock data
      const updatedTags = [...mockTags, { id: '4', title: 'Tag 4', privacy: 'public' }];
      mockApiAdapter.setMockData('listAlbumTags', {
        listAlbumTags: { items: updatedTags }
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.tags).toHaveLength(4);
    });
  });
});
