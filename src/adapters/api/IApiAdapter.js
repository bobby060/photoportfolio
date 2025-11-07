/**
 * @typedef {Object} QueryOptions
 * @property {Object} [variables] - GraphQL variables
 * @property {string} [authMode] - Authentication mode ('apiKey' or 'userPool')
 */

/**
 * @typedef {Object} UploadProgress
 * @property {number} loaded - Bytes uploaded
 * @property {number} total - Total bytes
 */

/**
 * API Adapter Interface
 * All API adapters must implement these methods
 */
export class IApiAdapter {
  /**
   * Execute a GraphQL query
   * @param {string} query - GraphQL query string
   * @param {QueryOptions} [options] - Query options
   * @returns {Promise<any>}
   */
  async query(query, options = {}) {
    throw new Error('query() must be implemented');
  }

  /**
   * Execute a GraphQL mutation
   * @param {string} mutation - GraphQL mutation string
   * @param {QueryOptions} [options] - Mutation options
   * @returns {Promise<any>}
   */
  async mutate(mutation, options = {}) {
    throw new Error('mutate() must be implemented');
  }

  /**
   * Upload a file to storage
   * @param {string} key - Storage key/path
   * @param {File|Blob} file - File to upload
   * @param {Object} [options] - Upload options
   * @returns {Promise<{key: string}>}
   */
  async uploadFile(key, file, options = {}) {
    throw new Error('uploadFile() must be implemented');
  }

  /**
   * Get a signed URL for a file
   * @param {string} key - Storage key/path
   * @returns {Promise<string>}
   */
  async getFileUrl(key) {
    throw new Error('getFileUrl() must be implemented');
  }

  /**
   * Delete a file from storage
   * @param {string} key - Storage key/path
   * @returns {Promise<void>}
   */
  async deleteFile(key) {
    throw new Error('deleteFile() must be implemented');
  }
}
