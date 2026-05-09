'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from './useRepositories';

/**
 * Storage Hook
 * Provides persistent storage with React state synchronization
 *
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @param {Object} options - Storage options
 * @param {('local'|'session')} [options.storageType='local'] - Storage type
 * @param {boolean} [options.json=true] - Whether to serialize as JSON
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */
export function useStorage(key, initialValue, options = {}) {
  const { localStorage, sessionStorage } = useRepositories();
  const { storageType = 'local', json = true } = options;

  const storage = storageType === 'session' ? sessionStorage : localStorage;

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    async function loadValue() {
      try {
        const stored = json
          ? await storage.getJSON(key)
          : await storage.get(key);

        if (stored !== null) {
          setValue(stored);
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadValue();
  }, [key, storage, json]);

  // Update storage when value changes
  const updateValue = useCallback(async (newValue) => {
    try {
      setValue(newValue);
      if (json) {
        await storage.setJSON(key, newValue);
      } else {
        await storage.set(key, newValue);
      }
    } catch (error) {
      console.error('Failed to save to storage:', error);
      throw error;
    }
  }, [key, storage, json]);

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      setValue(initialValue);
      await storage.remove(key);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
      throw error;
    }
  }, [key, storage, initialValue]);

  return [value, updateValue, removeValue, loading];
}

/**
 * Hook for namespaced storage operations
 * @param {('local'|'session')} [storageType='local'] - Storage type
 * @returns {Object} Storage repository instance
 */
export function useStorageRepository(storageType = 'local') {
  const { localStorage, sessionStorage } = useRepositories();
  return storageType === 'session' ? sessionStorage : localStorage;
}
