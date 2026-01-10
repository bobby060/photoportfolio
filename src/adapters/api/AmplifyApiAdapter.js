import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { IApiAdapter } from './IApiAdapter';

/**
 * AWS Amplify API Adapter
 * Implements API operations using AWS AppSync GraphQL and S3 Storage
 */
export class AmplifyApiAdapter extends IApiAdapter {
  constructor() {
    super();
    // Create clients for different auth modes
    this.publicClient = generateClient({ authMode: 'apiKey' });
    this.authenticatedClient = generateClient({ authMode: 'userPool' });
  }

  /**
   * Execute a GraphQL query
   * @param {string} query - GraphQL query string
   * @param {Object} options - Query options
   * @param {Object} [options.variables] - GraphQL variables
   * @param {string} [options.authMode='apiKey'] - Authentication mode
   * @returns {Promise<any>}
   */
  async query(query, options = {}) {
    const { variables = {}, authMode = 'apiKey' } = options;
    const client = authMode === 'userPool' ? this.authenticatedClient : this.publicClient;

    try {
      const result = await client.graphql({
        query,
        variables,
      });
      return result.data;
    } catch (error) {
      console.error('GraphQL query error:', error);
      throw this._transformError(error);
    }
  }

  /**
   * Execute a GraphQL mutation
   * @param {string} mutation - GraphQL mutation string
   * @param {Object} options - Mutation options
   * @param {Object} [options.variables] - GraphQL variables
   * @param {string} [options.authMode='userPool'] - Authentication mode
   * @returns {Promise<any>}
   */
  async mutate(mutation, options = {}) {
    const { variables = {}, authMode = 'userPool' } = options;
    const client = authMode === 'userPool' ? this.authenticatedClient : this.publicClient;

    try {
      const result = await client.graphql({
        query: mutation,
        variables,
      });
      return result.data;
    } catch (error) {
      console.error('GraphQL mutation error:', error);
      throw this._transformError(error);
    }
  }

  /**
   * Upload a file to S3 storage
   * @param {string} key - Storage key/path
   * @param {File|Blob} file - File to upload
   * @param {Object} [options] - Upload options
   * @param {Function} [options.onProgress] - Progress callback
   * @returns {Promise<{key: string}>}
   */
  async uploadFile(key, file, options = {}) {
    try {
      const { onProgress, ...uploadOptions } = options;

      const uploadTask = uploadData({
        key,
        data: file,
        options: {
          contentType: file.type,
          ...uploadOptions
        }
      });

      // Attach progress listener if provided
      if (onProgress) {
        uploadTask.onProgress = ({ transferredBytes, totalBytes }) => {
          onProgress({
            loaded: transferredBytes,
            total: totalBytes
          });
        };
      }

      const result = await uploadTask.result;

      return { key: result.key };
    } catch (error) {
      console.error('File upload error:', error);
      throw this._transformError(error);
    }
  }

  /**
   * Get a signed URL for a file in S3
   * @param {string} key - Storage key/path
   * @returns {Promise<string>}
   */
  async getFileUrl(key) {
    try {
      const result = await getUrl({ key });
      return result.url.toString();
    } catch (error) {
      console.error('Get file URL error:', error);
      throw this._transformError(error);
    }
  }

  /**
   * Delete a file from S3 storage
   * @param {string} key - Storage key/path
   * @returns {Promise<void>}
   */
  async deleteFile(key) {
    try {
      await remove({ key });
    } catch (error) {
      console.error('File deletion error:', error);
      throw this._transformError(error);
    }
  }

  /**
   * Transform Amplify errors into a consistent format
   * @private
   * @param {Error} error - Original error
   * @returns {Error}
   */
  _transformError(error) {
    const transformedError = new Error(error.message || 'An error occurred');
    transformedError.code = error.code || error.name || 'UNKNOWN_ERROR';
    transformedError.originalError = error;

    // Extract additional error details from GraphQL errors
    if (error.errors && Array.isArray(error.errors)) {
      transformedError.message = error.errors.map(e => e.message).join(', ');
      transformedError.details = error.errors;
    }

    return transformedError;
  }
}
