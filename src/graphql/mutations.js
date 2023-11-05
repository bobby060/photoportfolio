/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
