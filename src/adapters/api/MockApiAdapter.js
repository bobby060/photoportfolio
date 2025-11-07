import { IApiAdapter } from './IApiAdapter';

/**
 * Mock API Adapter for Testing
 * Simulates API operations without external dependencies
 */
export class MockApiAdapter extends IApiAdapter {
  constructor() {
    super();
    this.mockData = new Map();
    this.mockFiles = new Map();
    this.queryCallHistory = [];
    this.mutateCallHistory = [];
    this.uploadCallHistory = [];
  }

  /**
   * Set mock data for a specific query/mutation
   * @param {string} key - Query/mutation identifier
   * @param {any} data - Mock data to return
   */
  setMockData(key, data) {
    this.mockData.set(key, data);
  }

  /**
   * Set mock error for a specific query/mutation
   * @param {string} key - Query/mutation identifier
   * @param {Error} error - Error to throw
   */
  setMockError(key, error) {
    this.mockData.set(key, { _error: error });
  }

  /**
   * Execute a mock GraphQL query
   * @param {string} query - GraphQL query string
   * @param {Object} options - Query options
   * @returns {Promise<any>}
   */
  async query(query, options = {}) {
    this.queryCallHistory.push({ query, options });

    // Extract query name from GraphQL string
    const queryName = this._extractOperationName(query);
    const mockResponse = this.mockData.get(queryName);

    if (mockResponse && mockResponse._error) {
      throw mockResponse._error;
    }

    if (mockResponse) {
      return mockResponse;
    }

    // Return default empty response
    return {};
  }

  /**
   * Execute a mock GraphQL mutation
   * @param {string} mutation - GraphQL mutation string
   * @param {Object} options - Mutation options
   * @returns {Promise<any>}
   */
  async mutate(mutation, options = {}) {
    this.mutateCallHistory.push({ mutation, options });

    // Extract mutation name from GraphQL string
    const mutationName = this._extractOperationName(mutation);
    const mockResponse = this.mockData.get(mutationName);

    if (mockResponse && mockResponse._error) {
      throw mockResponse._error;
    }

    if (mockResponse) {
      return mockResponse;
    }

    // Return the input as the response (simulating create/update)
    if (options.variables && options.variables.input) {
      const operationKey = mutationName.replace('create', '').replace('update', '').replace('delete', '');
      return {
        [mutationName]: {
          id: Math.random().toString(36).substr(2, 9),
          ...options.variables.input
        }
      };
    }

    return {};
  }

  /**
   * Mock file upload
   * @param {string} key - Storage key/path
   * @param {File|Blob} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<{key: string}>}
   */
  async uploadFile(key, file, options = {}) {
    this.uploadCallHistory.push({ key, file, options });

    // Simulate upload delay
    if (options.onProgress) {
      options.onProgress({ loaded: file.size, total: file.size });
    }

    // Store file reference
    this.mockFiles.set(key, file);

    return { key };
  }

  /**
   * Get mock file URL
   * @param {string} key - Storage key/path
   * @returns {Promise<string>}
   */
  async getFileUrl(key) {
    if (this.mockFiles.has(key)) {
      return `mock://storage/${key}`;
    }
    throw new Error(`File not found: ${key}`);
  }

  /**
   * Extract operation name from GraphQL string
   * @private
   * @param {string} graphqlString
   * @returns {string}
   */
  _extractOperationName(graphqlString) {
    // Try to extract from query/mutation name
    const matches = graphqlString.match(/(?:query|mutation)\s+(\w+)/);
    if (matches && matches[1]) {
      return matches[1];
    }

    // Try to extract from first field after query/mutation keyword
    const fieldMatches = graphqlString.match(/(?:query|mutation)[^{]*{\s*(\w+)/);
    if (fieldMatches && fieldMatches[1]) {
      return fieldMatches[1];
    }

    return 'unknown';
  }

  /**
   * Reset all mock data and history (for testing)
   */
  reset() {
    this.mockData.clear();
    this.mockFiles.clear();
    this.queryCallHistory = [];
    this.mutateCallHistory = [];
    this.uploadCallHistory = [];
  }

  /**
   * Get call history for assertions (for testing)
   * @returns {Object}
   */
  getCallHistory() {
    return {
      queries: this.queryCallHistory,
      mutations: this.mutateCallHistory,
      uploads: this.uploadCallHistory
    };
  }

  /**
   * Helper to create mock album data (for testing)
   * @param {Object} overrides
   * @returns {Object}
   */
  static createMockAlbum(overrides = {}) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Mock Album',
      description: 'Mock album description',
      date: new Date().toISOString(),
      privacy: 'public',
      featured: false,
      images: { items: [] },
      ...overrides
    };
  }

  /**
   * Helper to create mock image data (for testing)
   * @param {Object} overrides
   * @returns {Object}
   */
  static createMockImage(overrides = {}) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'mock-image.jpg',
      description: 'Mock image',
      albumID: 'mock-album-id',
      ...overrides
    };
  }
}
