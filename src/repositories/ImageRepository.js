import * as mutations from '../graphql/mutations';

/**
 * Image Repository
 * Handles image upload, update, and deletion operations
 */
export class ImageRepository {
  constructor(apiAdapter) {
    this.api = apiAdapter;
  }

  /**
   * Upload a single image to an album
   * @param {string} albumId - Album ID
   * @param {File} file - Image file
   * @param {Object} [metadata={}] - Image metadata
   * @param {string} [metadata.title] - Image title
   * @param {string} [metadata.desc] - Image description
   * @param {number} [metadata.index] - Display order index
   * @returns {Promise<Object>} Created image record
   */
  async uploadImage(albumId, file, metadata = {}) {
    try {
      // 1. Create image record in database
      const imageInput = {
        albumsID: albumId,
        title: metadata.title || file.name,
        desc: metadata.desc || '',
        filename: file.name,
        date: new Date().toISOString(),
        index: metadata.index || 0,
        width: metadata.width || 0,
        height: metadata.height || 0,
      };

      const createResult = await this.api.mutate(mutations.createImages, {
        variables: { input: imageInput },
        authMode: 'userPool'
      });

      const imageRecord = createResult.createImages;

      // 2. Upload file to S3 storage
      const uploadKey = `images/${imageRecord.id}`;
      await this.api.uploadFile(uploadKey, file, {
        onProgress: metadata.onProgress
      });

      return imageRecord;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images to an album
   * @param {string} albumId - Album ID
   * @param {File[]} files - Array of image files
   * @param {Function} [onProgress] - Progress callback (completed, total)
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(albumId, files, onProgress) {
    const results = [];
    let completed = 0;

    for (const file of files) {
      try {
        const result = await this.uploadImage(albumId, file);
        results.push({ success: true, file: file.name, data: result });
        completed++;

        if (onProgress) {
          onProgress(completed, files.length);
        }
      } catch (error) {
        results.push({ success: false, file: file.name, error: error.message });
        completed++;

        if (onProgress) {
          onProgress(completed, files.length);
        }
      }
    }

    return results;
  }

  /**
   * Upload images with rollback on failure
   * @param {string} albumId - Album ID
   * @param {File[]} files - Array of image files
   * @param {Function} [onProgress] - Progress callback (completed, total)
   * @returns {Promise<Array>} Array of created image records
   */
  async uploadImagesWithRollback(albumId, files, onProgress) {
    const uploadedImages = [];
    let completed = 0;

    try {
      for (const file of files) {
        const result = await this.uploadImage(albumId, file);
        uploadedImages.push(result);
        completed++;

        if (onProgress) {
          onProgress(completed, files.length);
        }
      }

      return uploadedImages;
    } catch (error) {
      // Rollback: delete all successfully uploaded images
      console.error('Upload failed, rolling back...', error);

      for (const image of uploadedImages) {
        try {
          await this.deleteImage(image.id);
        } catch (deleteError) {
          console.error('Rollback deletion failed for image:', image.id, deleteError);
        }
      }

      throw error;
    }
  }

  /**
   * Update image metadata
   * @param {string} imageId - Image ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async updateImage(imageId, updates) {
    const data = await this.api.mutate(mutations.updateImages, {
      variables: { input: { id: imageId, ...updates } },
      authMode: 'userPool'
    });
    return data.updateImages;
  }

  /**
   * Delete an image
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>}
   */
  async deleteImage(imageId) {
    const data = await this.api.mutate(mutations.deleteImages, {
      variables: { input: { id: imageId } },
      authMode: 'userPool'
    });
    return data.deleteImages;
  }

  /**
   * Delete multiple images
   * @param {string[]} imageIds - Array of image IDs
   * @returns {Promise<Array>} Array of deletion results
   */
  async deleteMultipleImages(imageIds) {
    const results = [];

    for (const imageId of imageIds) {
      try {
        const result = await this.deleteImage(imageId);
        results.push({ success: true, imageId, data: result });
      } catch (error) {
        results.push({ success: false, imageId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Reorder images in an album
   * @param {Array<{id: string, index: number}>} imageOrders - Array of {id, index} objects
   * @returns {Promise<Array>}
   */
  async reorderImages(imageOrders) {
    const results = [];

    for (const { id, index } of imageOrders) {
      try {
        const result = await this.updateImage(id, { index });
        results.push({ success: true, id, data: result });
      } catch (error) {
        results.push({ success: false, id, error: error.message });
      }
    }

    return results;
  }

  /**
   * Set featured image for album
   * @param {string} albumId - Album ID
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>}
   */
  async setFeaturedImage(albumId, imageId) {
    // This would update the album's albumsFeaturedImageId field
    // Using the AlbumRepository would be cleaner, but including here for completeness
    const data = await this.api.mutate(mutations.updateAlbums, {
      variables: {
        input: {
          id: albumId,
          albumsFeaturedImageId: imageId
        }
      },
      authMode: 'userPool'
    });
    return data.updateAlbums;
  }
}
