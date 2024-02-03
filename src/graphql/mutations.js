/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbumTags = /* GraphQL */ `
  mutation CreateAlbumTags(
    $input: CreateAlbumTagsInput!
    $condition: ModelAlbumTagsConditionInput
  ) {
    createAlbumTags(input: $input, condition: $condition) {
      id
      title
      privacy
      AlbumsHaveTags {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAlbumTags = /* GraphQL */ `
  mutation UpdateAlbumTags(
    $input: UpdateAlbumTagsInput!
    $condition: ModelAlbumTagsConditionInput
  ) {
    updateAlbumTags(input: $input, condition: $condition) {
      id
      title
      privacy
      AlbumsHaveTags {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAlbumTags = /* GraphQL */ `
  mutation DeleteAlbumTags(
    $input: DeleteAlbumTagsInput!
    $condition: ModelAlbumTagsConditionInput
  ) {
    deleteAlbumTags(input: $input, condition: $condition) {
      id
      title
      privacy
      AlbumsHaveTags {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createAlbums = /* GraphQL */ `
  mutation CreateAlbums(
    $input: CreateAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    createAlbums(input: $input, condition: $condition) {
      id
      title
      desc
      date
      Images {
        items {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featuredImage {
        id
        title
        desc
        filename
        date
        albumsID
        index
        width
        height
        url
        createdAt
        updatedAt
        __typename
      }
      albumtagss {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      privacy
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const updateAlbums = /* GraphQL */ `
  mutation UpdateAlbums(
    $input: UpdateAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    updateAlbums(input: $input, condition: $condition) {
      id
      title
      desc
      date
      Images {
        items {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featuredImage {
        id
        title
        desc
        filename
        date
        albumsID
        index
        width
        height
        url
        createdAt
        updatedAt
        __typename
      }
      albumtagss {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      privacy
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const deleteAlbums = /* GraphQL */ `
  mutation DeleteAlbums(
    $input: DeleteAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    deleteAlbums(input: $input, condition: $condition) {
      id
      title
      desc
      date
      Images {
        items {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featuredImage {
        id
        title
        desc
        filename
        date
        albumsID
        index
        width
        height
        url
        createdAt
        updatedAt
        __typename
      }
      albumtagss {
        items {
          id
          albumTagsId
          albumsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      privacy
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const createImages = /* GraphQL */ `
  mutation CreateImages(
    $input: CreateImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    createImages(input: $input, condition: $condition) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      width
      height
      url
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateImages = /* GraphQL */ `
  mutation UpdateImages(
    $input: UpdateImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    updateImages(input: $input, condition: $condition) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      width
      height
      url
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteImages = /* GraphQL */ `
  mutation DeleteImages(
    $input: DeleteImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    deleteImages(input: $input, condition: $condition) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      width
      height
      url
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUrl = /* GraphQL */ `
  mutation CreateUrl(
    $input: CreateUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    createUrl(input: $input, condition: $condition) {
      id
      album {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      urlAlbumId
      __typename
    }
  }
`;
export const updateUrl = /* GraphQL */ `
  mutation UpdateUrl(
    $input: UpdateUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    updateUrl(input: $input, condition: $condition) {
      id
      album {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      urlAlbumId
      __typename
    }
  }
`;
export const deleteUrl = /* GraphQL */ `
  mutation DeleteUrl(
    $input: DeleteUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    deleteUrl(input: $input, condition: $condition) {
      id
      album {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      urlAlbumId
      __typename
    }
  }
`;
export const createAlbumTagsAlbums = /* GraphQL */ `
  mutation CreateAlbumTagsAlbums(
    $input: CreateAlbumTagsAlbumsInput!
    $condition: ModelAlbumTagsAlbumsConditionInput
  ) {
    createAlbumTagsAlbums(input: $input, condition: $condition) {
      id
      albumTagsId
      albumsId
      albumTags {
        id
        title
        privacy
        AlbumsHaveTags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      albums {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAlbumTagsAlbums = /* GraphQL */ `
  mutation UpdateAlbumTagsAlbums(
    $input: UpdateAlbumTagsAlbumsInput!
    $condition: ModelAlbumTagsAlbumsConditionInput
  ) {
    updateAlbumTagsAlbums(input: $input, condition: $condition) {
      id
      albumTagsId
      albumsId
      albumTags {
        id
        title
        privacy
        AlbumsHaveTags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      albums {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAlbumTagsAlbums = /* GraphQL */ `
  mutation DeleteAlbumTagsAlbums(
    $input: DeleteAlbumTagsAlbumsInput!
    $condition: ModelAlbumTagsAlbumsConditionInput
  ) {
    deleteAlbumTagsAlbums(input: $input, condition: $condition) {
      id
      albumTagsId
      albumsId
      albumTags {
        id
        title
        privacy
        AlbumsHaveTags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      albums {
        id
        title
        desc
        date
        Images {
          nextToken
          __typename
        }
        featuredImage {
          id
          title
          desc
          filename
          date
          albumsID
          index
          width
          height
          url
          createdAt
          updatedAt
          __typename
        }
        albumtagss {
          nextToken
          __typename
        }
        privacy
        createdAt
        updatedAt
        albumsFeaturedImageId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
