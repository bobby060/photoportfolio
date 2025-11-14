import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { RepositoryProvider } from '../../providers/RepositoryProvider';
import { MockAuthAdapter } from '../../adapters/auth/MockAuthAdapter';
import { MockApiAdapter } from '../../adapters/api/MockApiAdapter';
import { MemoryStorageAdapter } from '../../adapters/storage/MemoryStorageAdapter';

describe('useAuth', () => {
  let mockAuthAdapter;
  let mockApiAdapter;
  let mockStorageAdapter;

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
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should start with loading true and no user', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('loading user', () => {
    it('should load authenticated user', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });

    it('should load admin user', async () => {
      const mockUser = MockAuthAdapter.createMockAdminUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(true);
    });

    it('should handle no user (not authenticated)', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isAdmin).toBe(false);
    });

    it('should handle load error gracefully', async () => {
      mockAuthAdapter.setMockError(new Error('Auth failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out user', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockAuthAdapter.signOutCalled).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear cache on sign out', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      const clearCacheSpy = jest.spyOn(mockAuthAdapter, 'clearCache');

      await act(async () => {
        await result.current.signOut();
      });

      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      mockAuthAdapter.signOutError = new Error('Sign out failed');

      await act(async () => {
        await expect(result.current.signOut()).rejects.toThrow('Sign out failed');
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('refreshUser', () => {
    it('should refresh user data', async () => {
      const originalUser = MockAuthAdapter.createMockUser({ username: 'original' });
      mockAuthAdapter.setMockUser(originalUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(originalUser);
      });

      const updatedUser = MockAuthAdapter.createMockUser({ username: 'updated' });
      mockAuthAdapter.setMockUser(updatedUser);

      await act(async () => {
        const refreshed = await result.current.refreshUser();
        expect(refreshed).toEqual(updatedUser);
      });

      expect(result.current.user).toEqual(updatedUser);
    });

    it('should clear cache before refreshing', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      const clearCacheSpy = jest.spyOn(mockAuthAdapter, 'clearCache');

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(clearCacheSpy).toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    it('should not throw when authenticated', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await expect(result.current.requireAuth()).resolves.not.toThrow();
      });
    });

    it('should throw when not authenticated', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await expect(result.current.requireAuth()).rejects.toThrow();
      });
    });
  });

  describe('requireAdmin', () => {
    it('should not throw when user is admin', async () => {
      const mockUser = MockAuthAdapter.createMockAdminUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await expect(result.current.requireAdmin()).resolves.not.toThrow();
      });
    });

    it('should throw when user is not admin', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await expect(result.current.requireAdmin()).rejects.toThrow();
      });
    });
  });

  describe('periodic refresh', () => {
    it('should refresh user data every 5 minutes', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Fast-forward 5 minutes
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      // User should be refreshed (adapter would be called again)
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });
    });

    it('should cleanup interval on unmount', async () => {
      const mockUser = MockAuthAdapter.createMockUser();
      mockAuthAdapter.setMockUser(mockUser);

      const { result, unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
