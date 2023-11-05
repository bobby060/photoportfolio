/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbums = /* GraphQL */ `
  subscription OnCreateAlbums($filter: ModelSubscriptionAlbumsFilterInput) {
    onCreateAlbums(filter: $filter) {
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
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const onUpdateAlbums = /* GraphQL */ `
  subscription OnUpdateAlbums($filter: ModelSubscriptionAlbumsFilterInput) {
    onUpdateAlbums(filter: $filter) {
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
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const onDeleteAlbums = /* GraphQL */ `
  subscription OnDeleteAlbums($filter: ModelSubscriptionAlbumsFilterInput) {
    onDeleteAlbums(filter: $filter) {
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
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      albumsFeaturedImageId
      __typename
    }
  }
`;
export const onCreateImages = /* GraphQL */ `
  subscription OnCreateImages($filter: ModelSubscriptionImagesFilterInput) {
    onCreateImages(filter: $filter) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateImages = /* GraphQL */ `
  subscription OnUpdateImages($filter: ModelSubscriptionImagesFilterInput) {
    onUpdateImages(filter: $filter) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteImages = /* GraphQL */ `
  subscription OnDeleteImages($filter: ModelSubscriptionImagesFilterInput) {
    onDeleteImages(filter: $filter) {
      id
      title
      desc
      filename
      date
      albumsID
      index
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
