import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useStorageRepository } from '../../hooks/useStorage';
import { RepositoryProvider } from '../../providers/RepositoryProvider';
import { MockAuthAdapter } from '../../adapters/auth/MockAuthAdapter';
import { MockApiAdapter } from '../../adapters/api/MockApiAdapter';
import { MemoryStorageAdapter } from '../../adapters/storage/MemoryStorageAdapter';

describe('useStorage', () => {
  let mockAuthAdapter;
  let mockApiAdapter;
  let mockLocalStorageAdapter;
  let mockSessionStorageAdapter;

  const wrapper = ({ children }) => (
    <RepositoryProvider
      adapters={{
        auth: mockAuthAdapter,
        api: mockApiAdapter,
        localStorage: mockLocalStorageAdapter,
        sessionStorage: mockSessionStorageAdapter
      }}
    >
      {children}
    </RepositoryProvider>
  );

  beforeEach(() => {
    mockAuthAdapter = new MockAuthAdapter();
    mockApiAdapter = new MockApiAdapter();
    mockLocalStorageAdapter = new MemoryStorageAdapter();
    mockSessionStorageAdapter = new MemoryStorageAdapter();
  });

  describe('localStorage', () => {
    it('should set and get item from localStorage', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.set('testKey', 'testValue');
      });

      await act(async () => {
        const value = await result.current.get('testKey');
        expect(value).toBe('testValue');
      });
    });

    it('should remove item from localStorage', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.set('testKey', 'testValue');
      });

      await act(async () => {
        await result.current.remove('testKey');
      });

      await act(async () => {
        const value = await result.current.get('testKey');
        expect(value).toBeNull();
      });
    });

    it('should clear all items from localStorage', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.set('key1', 'value1');
        await result.current.set('key2', 'value2');
      });

      await act(async () => {
        await result.current.clear();
      });

      await act(async () => {
        const value1 = await result.current.get('key1');
        const value2 = await result.current.get('key2');
        expect(value1).toBeNull();
        expect(value2).toBeNull();
      });
    });

    it('should get all keys from localStorage', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.set('key1', 'value1');
        await result.current.set('key2', 'value2');
      });

      await act(async () => {
        const keys = await result.current.keys();
        expect(keys).toContain('photoportfolio_key1');
        expect(keys).toContain('photoportfolio_key2');
      });
    });
  });

  describe('sessionStorage', () => {
    it('should set and get item from sessionStorage', async () => {
      const { result } = renderHook(() => useStorageRepository('session'), { wrapper });

      await act(async () => {
        await result.current.set('testKey', 'testValue');
      });

      await act(async () => {
        const value = await result.current.get('testKey');
        expect(value).toBe('testValue');
      });
    });

    it('should handle JSON data', async () => {
      const { result } = renderHook(() => useStorageRepository('session'), { wrapper });

      const testObject = { name: 'test', value: 123 };

      await act(async () => {
        await result.current.setJSON('testKey', testObject);
      });

      await act(async () => {
        const value = await result.current.getJSON('testKey');
        expect(value).toEqual(testObject);
      });
    });
  });

  describe('JSON operations', () => {
    it('should store and retrieve JSON objects', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      const testData = {
        user: 'john',
        settings: { theme: 'dark', notifications: true }
      };

      await act(async () => {
        await result.current.setJSON('config', testData);
      });

      await act(async () => {
        const retrieved = await result.current.getJSON('config');
        expect(retrieved).toEqual(testData);
      });
    });

    it('should return null for non-existent JSON key', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        const value = await result.current.getJSON('nonexistent');
        expect(value).toBeNull();
      });
    });

    it('should handle invalid JSON gracefully', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      // Set invalid JSON manually
      await act(async () => {
        await result.current.set('invalidJSON', 'not-valid-json{');
      });

      await act(async () => {
        const value = await result.current.getJSON('invalidJSON');
        expect(value).toBeNull();
      });
    });
  });

  describe('TTL operations', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should store item with TTL', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.setWithTTL('tempKey', 'tempValue', 1000);
      });

      // Should be available immediately
      await act(async () => {
        const value = await result.current.getWithTTL('tempKey');
        expect(value).toBe('tempValue');
      });
    });

    it('should expire item after TTL', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.setWithTTL('tempKey', 'tempValue', 1000);
      });

      // Fast-forward past TTL
      act(() => {
        jest.advanceTimersByTime(1001);
      });

      // Should be null after expiry
      await act(async () => {
        const value = await result.current.getWithTTL('tempKey');
        expect(value).toBeNull();
      });
    });

    it('should store JSON with TTL', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      const testData = { test: 'data' };

      await act(async () => {
        await result.current.setWithTTL('tempJSON', testData, 1000);
      });

      await act(async () => {
        const value = await result.current.getWithTTL('tempJSON');
        expect(value).toEqual(testData);
      });

      // Fast-forward past TTL
      act(() => {
        jest.advanceTimersByTime(1001);
      });

      await act(async () => {
        const value = await result.current.getWithTTL('tempJSON');
        expect(value).toBeNull();
      });
    });
  });

  describe('namespace operations', () => {
    it('should use default namespace', async () => {
      const { result } = renderHook(() => useStorageRepository('local'), { wrapper });

      await act(async () => {
        await result.current.set('key', 'value');
      });

      await act(async () => {
        const value = await result.current.get('key');
        expect(value).toBe('value');
      });

      // Check that key is namespaced with default prefix
      await act(async () => {
        const keys = await result.current.keys();
        expect(keys[0]).toContain('photoportfolio_');
      });
    });

    it('should isolate local and session storage', async () => {
      const { result: result1 } = renderHook(() => useStorageRepository('local'), { wrapper });
      const { result: result2 } = renderHook(() => useStorageRepository('session'), { wrapper });

      await act(async () => {
        await result1.current.set('key', 'value1');
        await result2.current.set('key', 'value2');
      });

      await act(async () => {
        const value1 = await result1.current.get('key');
        const value2 = await result2.current.get('key');
        expect(value1).toBe('value1');
        expect(value2).toBe('value2');
      });
    });
  });

  describe('error handling', () => {
    it('should handle storage errors gracefully', async () => {
      // Create a storage adapter that throws errors
      const errorAdapter = new MemoryStorageAdapter();
      errorAdapter.setItem = jest.fn().mockRejectedValue(new Error('Storage error'));

      const errorWrapper = ({ children }) => (
        <RepositoryProvider
          adapters={{
            auth: mockAuthAdapter,
            api: mockApiAdapter,
            localStorage: errorAdapter,
            sessionStorage: errorAdapter
          }}
        >
          {children}
        </RepositoryProvider>
      );

      const { result } = renderHook(() => useStorageRepository('local'), { wrapper: errorWrapper });

      await act(async () => {
        // Should not throw, should handle gracefully
        await expect(result.current.set('key', 'value')).rejects.toThrow();
      });
    });
  });
});
