'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from './useRepositories';

/**
 * Albums Hook
 * Fetches and manages album data with optional caching
 *
 * @param {Object} options - Fetch options
 * @param {boolean} [options.useCache=true] - Whether to use session cache
 * @param {('all'|'public'|'featured')} [options.filter='all'] - Filter type
 * @param {boolean} [options.autoFetch=true] - Whether to fetch automatically on mount
 * @returns {Object} Albums state and methods
 */
export function useAlbums(options = {}) {
  const { albums: albumRepo, sessionStorage } = useRepositories();
  const { useCache = true, filter = 'all', autoFetch = true } = options;

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(autoFetch); // Start with loading=true only if autoFetch is enabled
  const [error, setError] = useState(null);

  // Fetch albums function
  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try cache first
      if (useCache) {
        const cached = await sessionStorage.albumCache.get();
        if (cached) {
          setAlbums(cached);
          setLoading(false);
          return cached;
        }
      }

      // Fetch from API
      let data;
      switch (filter) {
        case 'public':
          data = await albumRepo.getPublicAlbums();
          break;
        case 'featured':
          data = await albumRepo.getFeaturedAlbums();
          break;
        default:
          data = await albumRepo.getAllAlbums();
      }

      setAlbums(data);

      // Update cache
      if (useCache) {
        await sessionStorage.albumCache.set(data);
      }

      setLoading(false);
      return data;
    } catch (err) {
      console.error('Failed to fetch albums:', err);
      setError(err);
      setLoading(false);
      return [];
    }
  }, [albumRepo, sessionStorage, useCache, filter]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchAlbums();
    }
  }, [autoFetch, fetchAlbums]);

  // Clear cache
  const clearCache = useCallback(async () => {
    await sessionStorage.albumCache.clear();
  }, [sessionStorage]);

  // Refetch (clears cache first)
  const refetch = useCallback(async () => {
    await clearCache();
    return fetchAlbums();
  }, [clearCache, fetchAlbums]);

  return {
    albums,
    loading,
    error,
    fetchAlbums,
    refetch,
    clearCache
  };
}

/**
 * Single Album Hook
 * Fetches a single album by ID or URL
 *
 * @param {string} albumIdOrUrl - Album ID or URL
 * @param {Object} options - Fetch options
 * @param {boolean} [options.autoFetch=true] - Whether to fetch automatically
 * @returns {Object} Album state and methods
 */
export function useAlbum(albumIdOrUrl, options = {}) {
  const { albums: albumRepo } = useRepositories();
  const { autoFetch = true } = options;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbum = useCallback(async () => {
    if (!albumIdOrUrl) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine if it's an ID or URL based on format
      const isUrl = albumIdOrUrl.includes('-') && isNaN(albumIdOrUrl);
      const data = isUrl
        ? await albumRepo.getAlbumByUrl(albumIdOrUrl)
        : await albumRepo.getAlbumById(albumIdOrUrl);

      setAlbum(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Failed to fetch album:', err);
      setError(err);
      setLoading(false);
      return null;
    }
  }, [albumIdOrUrl, albumRepo]);

  useEffect(() => {
    if (autoFetch) {
      fetchAlbum();
    }
  }, [autoFetch, fetchAlbum]);

  return {
    album,
    loading,
    error,
    refetch: fetchAlbum
  };
}

/**
 * Album Tags Hook
 * Fetches album tags
 *
 * @param {Object} options - Fetch options
 * @param {('all'|'public')} [options.filter='all'] - Filter type
 * @param {boolean} [options.autoFetch=true] - Whether to fetch automatically
 * @returns {Object} Tags state and methods
 */
export function useAlbumTags(options = {}) {
  const { albums: albumRepo } = useRepositories();
  const { filter = 'all', autoFetch = true } = options;

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = filter === 'public'
        ? await albumRepo.getPublicAlbumTags()
        : await albumRepo.getAlbumTags();

      setTags(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError(err);
      setLoading(false);
      return [];
    }
  }, [albumRepo, filter]);

  useEffect(() => {
    if (autoFetch) {
      fetchTags();
    }
  }, [autoFetch, fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags
  };
}
