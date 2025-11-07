import * as queries from '../graphql/queries';
import * as customQueries from '../graphql/customQueries';
import * as mutations from '../graphql/mutations';

/**
 * Album Repository
 * Handles album CRUD operations and queries
 */
export class AlbumRepository {
  constructor(apiAdapter) {
    this.api = apiAdapter;
  }

  /**
   * Get all albums
   * @returns {Promise<Array>}
   */
  async getAllAlbums() {
    const data = await this.api.query(queries.listAlbums, { authMode: 'apiKey' });
    const albums = data.listAlbums.items;

    // Sort by date descending (newest first)
    return albums.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Get album by ID
   * @param {string} id - Album ID
   * @returns {Promise<Object|null>}
   */
  async getAlbumById(id) {
    const data = await this.api.query(queries.getAlbums, {
      variables: { id },
      authMode: 'apiKey'
    });
    return data.getAlbums;
  }

  /**
   * Get album by URL
   * @param {string} url - Album URL
   * @returns {Promise<Object|null>}
   */
  async getAlbumByUrl(url) {
    const decodedUrl = decodeURIComponent(url);
    const data = await this.api.query(customQueries.getUrl, {
      variables: { id: decodedUrl },
      authMode: 'apiKey'
    });
    return data.getUrl?.album || null;
  }

  /**
   * Get public albums only
   * @returns {Promise<Array>}
   */
  async getPublicAlbums() {
    const albums = await this.getAllAlbums();
    return albums.filter(album => album.privacy === 'public');
  }

  /**
   * Get featured albums
   * @returns {Promise<Array>}
   */
  async getFeaturedAlbums() {
    const albums = await this.getAllAlbums();
    return albums.filter(album => album.featured === true);
  }

  /**
   * Get all album tags
   * @returns {Promise<Array>}
   */
  async getAlbumTags() {
    const data = await this.api.query(queries.listAlbumTags, {
      authMode: 'apiKey'
    });
    return data.listAlbumTags.items;
  }

  /**
   * Get public album tags only
   * @returns {Promise<Array>}
   */
  async getPublicAlbumTags() {
    const data = await this.api.query(queries.listAlbumTags, {
      variables: { filter: { privacy: { eq: 'public' } } },
      authMode: 'apiKey'
    });
    return data.listAlbumTags.items;
  }

  /**
   * Get albums by tag
   * @param {string} tagId - Tag ID
   * @returns {Promise<Array>}
   */
  async getAlbumsByTag(tagId) {
    const data = await this.api.query(customQueries.albumTagsAlbumsByAlbumTagsId, {
      variables: { albumTagsId: tagId },
      authMode: 'apiKey'
    });
    return data.albumTagsAlbumsByAlbumTagsId.items.map(item => item.albums);
  }

  /**
   * Create a new album (requires authentication)
   * @param {Object} albumData - Album data
   * @returns {Promise<Object>}
   */
  async createAlbum(albumData) {
    const data = await this.api.mutate(mutations.createAlbums, {
      variables: { input: albumData },
      authMode: 'userPool'
    });
    return data.createAlbums;
  }

  /**
   * Update an existing album (requires authentication)
   * @param {string} id - Album ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async updateAlbum(id, updates) {
    const data = await this.api.mutate(mutations.updateAlbums, {
      variables: { input: { id, ...updates } },
      authMode: 'userPool'
    });
    return data.updateAlbums;
  }

  /**
   * Delete an album (requires authentication)
   * @param {string} id - Album ID
   * @returns {Promise<Object>}
   */
  async deleteAlbum(id) {
    const data = await this.api.mutate(mutations.deleteAlbums, {
      variables: { input: { id } },
      authMode: 'userPool'
    });
    return data.deleteAlbums;
  }

  /**
   * Create album tag (requires authentication)
   * @param {Object} tagData - Tag data
   * @returns {Promise<Object>}
   */
  async createAlbumTag(tagData) {
    const data = await this.api.mutate(mutations.createAlbumTags, {
      variables: { input: tagData },
      authMode: 'userPool'
    });
    return data.createAlbumTags;
  }

  /**
   * Update album tag (requires authentication)
   * @param {string} id - Tag ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async updateAlbumTag(id, updates) {
    const data = await this.api.mutate(mutations.updateAlbumTags, {
      variables: { input: { id, ...updates } },
      authMode: 'userPool'
    });
    return data.updateAlbumTags;
  }

  /**
   * Delete album tag (requires authentication)
   * @param {string} id - Tag ID
   * @returns {Promise<Object>}
   */
  async deleteAlbumTag(id) {
    const data = await this.api.mutate(mutations.deleteAlbumTags, {
      variables: { input: { id } },
      authMode: 'userPool'
    });
    return data.deleteAlbumTags;
  }

  /**
   * Generate URL-safe identifier for album
   * @param {Object} album - Album object with id and title
   * @returns {string}
   */
  generateAlbumUrl(album) {
    const ending = album.id.slice(-2);
    const name = album.title.toLowerCase().replace(/\s+/g, '-');
    return `${name}-${ending}`;
  }

  /**
   * Generate URL-safe identifier for album (encoded)
   * @param {Object} album - Album object with id and title
   * @returns {string}
   */
  generateAlbumUrlSafe(album) {
    const url = this.generateAlbumUrl(album);
    return encodeURIComponent(url);
  }
}
