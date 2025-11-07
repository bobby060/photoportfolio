'use client';

import { createContext, useMemo } from 'react';
import { AmplifyAuthAdapter } from '../adapters/auth/AmplifyAuthAdapter';
import { LocalStorageAdapter } from '../adapters/storage/LocalStorageAdapter';
import { SessionStorageAdapter } from '../adapters/storage/SessionStorageAdapter';
import { MemoryStorageAdapter } from '../adapters/storage/MemoryStorageAdapter';
import { AmplifyApiAdapter } from '../adapters/api/AmplifyApiAdapter';
import { AuthRepository } from '../repositories/AuthRepository';
import { StorageRepository } from '../repositories/StorageRepository';
import { AlbumRepository } from '../repositories/AlbumRepository';
import { ImageRepository } from '../repositories/ImageRepository';

/**
 * Repository Context
 * Provides access to all repositories via React Context
 */
export const RepositoryContext = createContext(null);

/**
 * Repository Provider Component
 * Initializes and provides all repositories to the component tree
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} [props.adapters] - Optional custom adapters for dependency injection (mainly for testing)
 */
export function RepositoryProvider({ children, adapters = {} }) {
  const repositories = useMemo(() => {
    // Check if we're on the server or client
    const isServer = typeof window === 'undefined';

    // Allow dependency injection for testing or custom implementations
    const authAdapter = adapters.auth || new AmplifyAuthAdapter();

    // Use MemoryStorageAdapter during SSR to avoid browser API errors
    const localStorageAdapter = adapters.localStorage ||
      (isServer ? new MemoryStorageAdapter() : new LocalStorageAdapter());

    const sessionStorageAdapter = adapters.sessionStorage ||
      (isServer ? new MemoryStorageAdapter() : new SessionStorageAdapter());

    const apiAdapter = adapters.api || new AmplifyApiAdapter();

    return {
      // Main repositories
      auth: new AuthRepository(authAdapter),
      localStorage: new StorageRepository(localStorageAdapter),
      sessionStorage: new StorageRepository(sessionStorageAdapter),
      albums: new AlbumRepository(apiAdapter),
      images: new ImageRepository(apiAdapter),

      // Expose adapters for advanced use cases
      _adapters: {
        auth: authAdapter,
        localStorage: localStorageAdapter,
        sessionStorage: sessionStorageAdapter,
        api: apiAdapter
      }
    };
  }, [adapters]);

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}
