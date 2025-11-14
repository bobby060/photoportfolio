'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRepositories } from './useRepositories';

/**
 * Authentication Hook
 * Provides authentication state and operations using AuthRepository
 * Now properly leverages the repository's caching mechanism
 *
 * @returns {Object} Auth state and methods
 */
export function useAuth() {
  const { auth } = useRepositories();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // Load user data directly from AuthRepository (uses adapter's cache)
  const loadUser = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const userData = await auth.getUser();
      if (mountedRef.current) {
        setUser(userData);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      if (mountedRef.current) {
        setError(err);
        setUser(null);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [auth]);

  // Initial load and periodic refresh
  useEffect(() => {
    mountedRef.current = true;
    loadUser();

    // Optional: Refresh user data periodically (every 5 minutes)
    // This ensures the auth state stays fresh, leveraging the adapter's 1-minute cache
    const intervalId = setInterval(() => {
      loadUser();
    }, 5 * 60 * 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [loadUser]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await auth.logout();
      auth.clearCache();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out failed:', err);
      setError(err);
      throw err;
    }
  }, [auth]);

  // Refresh user data manually
  const refreshUser = useCallback(async () => {
    try {
      // Clear cache first to force fresh fetch
      auth.clearCache();
      const userData = await auth.getUser();
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
    isAuthenticated: user !== null,
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
