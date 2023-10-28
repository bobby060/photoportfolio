/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbums = /* GraphQL */ `
  query GetAlbums($id: ID!) {
    getAlbums(id: $id) {
      id
      title
      desc
      date
      featuredImg
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $filter: ModelAlbumsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        desc
        date
        featuredImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getImages = /* GraphQL */ `
  query GetImages($id: ID!) {
    getImages(id: $id) {
      id
      title
      desc
      filename
      date
      albumsID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        desc
        filename
        date
        albumsID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const imagesByAlbumsID = /* GraphQL */ `
  query ImagesByAlbumsID(
    $albumsID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelImagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    imagesByAlbumsID(
      albumsID: $albumsID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        desc
        filename
        date
        albumsID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
