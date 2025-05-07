/* Custom graphql queries, speciically that add additionally recursive depth when pulling album tags etc */

export const albumTagsAlbumsByAlbumTagsId = /* GraphQL */ `
  query AlbumTagsAlbumsByAlbumTagsId(
    $albumTagsId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAlbumTagsAlbumsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    albumTagsAlbumsByAlbumTagsId(
      albumTagsId: $albumTagsId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        albumTagsId
        albumsId
        albumTags {
          id
          title
          privacy
          createdAt
          updatedAt
          __typename
        }
        albums {
          id
          title
          desc
          date
          createdAt
          updatedAt
          albumsFeaturedImageId
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
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getUrl = /* GraphQL */ `
  query GetUrl($id: ID!) {
    getUrl(id: $id) {
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
      createdAt
      updatedAt
      urlAlbumId
      __typename
    }
  }
`;

export const albumByDate = /* GraphQL */ `
  query albumByDate(
    $filter: ModelAlbumsFilterInput
    $limit: Int
    $nextToken: String
    ) {
    albumByDate(
     type: "Album",
     sortDirection: DESC,
     filter: $filter,
     limit: $limit,
     nextToken: $nextToken
     ){
        items {
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
          nextToken
          __typename
    }
  }

`;