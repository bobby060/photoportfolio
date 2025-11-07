import { useContext } from 'react';
import { RepositoryContext } from '../providers/RepositoryProvider';

/**
 * Hook to access all repositories
 * @returns {Object} Repository collection
 * @throws {Error} If used outside RepositoryProvider
 */
export function useRepositories() {
  const context = useContext(RepositoryContext);

  if (!context) {
    throw new Error('useRepositories must be used within RepositoryProvider');
  }

  return context;
}
