"use strict";exports.id=89,exports.ids=[89],exports.modules={31336:(e,t,a)=>{a.d(t,{KN:()=>l,sL:()=>m});var d=a(98654),i=a(41040);let n=(0,d.D)({authMode:"apiKey"});function m(e){let t=e.id.slice(-2);return e.title.toLowerCase().replace(" ","-").concat("-",t)}async function l(e){let t=decodeURIComponent(e);try{return(await n.graphql({query:i.ID,variables:{id:t}})).data.getUrl.album}catch(e){throw console.error(e),Error("Album not found, "+e)}}},41040:(e,t,a)=>{a.d(t,{$3:()=>n,ID:()=>i,X8:()=>d});let d=`
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
`,i=`
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
`,n=`
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

`},53437:(e,t,a)=>{a.d(t,{AP:()=>m,J_:()=>d,KK:()=>s,Km:()=>i,LF:()=>n,Pi:()=>r,cD:()=>A,cO:()=>p,fF:()=>o,r0:()=>u,yd:()=>l});let d=`
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
`,i=`
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
`,n=`
  mutation CreateAlbums(
    $input: CreateAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    createAlbums(input: $input, condition: $condition) {
      id
      title
      type
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
`,m=`
  mutation UpdateAlbums(
    $input: UpdateAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    updateAlbums(input: $input, condition: $condition) {
      id
      title
      type
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
`,l=`
  mutation DeleteAlbums(
    $input: DeleteAlbumsInput!
    $condition: ModelAlbumsConditionInput
  ) {
    deleteAlbums(input: $input, condition: $condition) {
      id
      title
      type
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
`,u=`
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
`,s=`
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
`,p=`
  mutation CreateUrl(
    $input: CreateUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    createUrl(input: $input, condition: $condition) {
      id
      album {
        id
        title
        type
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
`,r=`
  mutation DeleteUrl(
    $input: DeleteUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    deleteUrl(input: $input, condition: $condition) {
      id
      album {
        id
        title
        type
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
`,o=`
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
        type
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
`,A=`
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
        type
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
`},77466:(e,t,a)=>{a.d(t,{FM:()=>d,LS:()=>l,X8:()=>u,Zt:()=>i,bl:()=>n,v8:()=>m});let d=`
  query ListAlbumTags(
    $filter: ModelAlbumTagsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbumTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`,i=`
  query GetAlbums($id: ID!) {
    getAlbums(id: $id) {
      id
      title
      type
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
`,n=`
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
`,m=`
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
  }
`,l=`
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
  }
`,u=`
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
          type
          desc
          date
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
      nextToken
      __typename
    }
  }
`},78162:(e,t,a)=>{a.r(t),a.d(t,{default:()=>i});var d=a(31658);let i=async e=>[{type:"image/png",sizes:"192x192",url:(0,d.fillMetadataSegment)(".",await e.params,"icon.png")+"?de3b7f245c4a07f6"}]}};