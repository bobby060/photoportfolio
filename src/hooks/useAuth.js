'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRepositories } from './useRepositories';

/**
 * Authentication Hook
 * Provides authentication state and operations
 *
 * @returns {Object} Auth state and methods
 */
export function useAuth() {
  const { auth } = useRepositories();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data when authentication status changes
  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        if (authStatus === 'authenticated') {
          const userData = await auth.getUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [authStatus, auth]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await auth.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out failed:', err);
      setError(err);
      throw err;
    }
  }, [auth]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const userData = await auth.refreshSession();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setError(err);
      throw err;
    }
  }, [auth]);

  // Check if current operation requires auth (throws if not authenticated)
  const requireAuth = useCallback(async () => {
    try {
      await auth.requireAuth();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [auth]);

  // Check if current operation requires admin (throws if not admin)
  const requireAdmin = useCallback(async () => {
    try {
      await auth.requireAdmin();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [auth]);

  return {
    // State
    user,
    isAuthenticated: authStatus === 'authenticated',
    isAdmin: user?.isAdmin ?? false,
    loading,
    error,

    // Methods
    signOut,
    refreshUser,
    requireAuth,
    requireAdmin
  };
}
