(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[366],{14698:()=>{},28716:()=>{},28848:()=>{},42955:(e,t,a)=>{"use strict";a.d(t,{Mp:()=>d,yy:()=>r});var i=a(76949),n=a(97583);let l=(0,i.D)({authMode:"apiKey"});async function d(){return(await l.graphql({query:n.FM})).data.listAlbumTags.items}async function r(){return(await l.graphql({query:n.FM,variables:{filter:{privacy:{eq:"public"}}}})).data.listAlbumTags.items}},45123:(e,t,a)=>{"use strict";let i;a.d(t,{A:()=>m});var n=a(16078),l=a(11489);let d={currentEnvironment:"notFound",environments:{notFound:{featuredTagId:"xxx",imageDeliveryHost:"xxx"}}};class r{constructor(){if(i)throw Error("New instance cannot be created");i=this}getValue(e){return d.environments[d.currentEnvironment][e]}updateValue(e,t){d.environments[d.currentEnvironment][e]=t}getCurrentEnvironment(){return d.currentEnvironment}setCurrentEnvironment(e){console.log(e),d.currentEnvironment=e,console.log(e)}async save(){let e=JSON.stringify(d);try{let t=await (0,n.C)({key:"portfolio-config.json",data:e}).result;console.log("Successfully saved config changes: ",t)}catch(e){console.warn("Error, config not saved: ",e)}}async updateConfig(){try{let e=await (0,l.X)({key:"portfolio-config.json",options:{accessLevel:"guest"}}).result;d=await e.body.text()}catch(e){console.warn("config not loaded: ",e)}d=JSON.parse(d)}}let m=Object.freeze(new r)},48013:()=>{},59340:()=>{},59928:()=>{},67926:()=>{},68295:()=>{},82638:(e,t,a)=>{"use strict";a.d(t,{$3:()=>l,ID:()=>n,X8:()=>i});let i=`
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
`,n=`
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
`,l=`
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

`},82906:(e,t,a)=>{"use strict";a.d(t,{KN:()=>r,sL:()=>d});var i=a(76949),n=a(82638);let l=(0,i.D)({authMode:"apiKey"});function d(e){let t=e.id.slice(-2);return e.title.toLowerCase().replace(" ","-").concat("-",t)}async function r(e){let t=decodeURIComponent(e);try{return(await l.graphql({query:n.ID,variables:{id:t}})).data.getUrl.album}catch(e){throw console.error(e),Error("Album not found, "+e)}}},88768:()=>{},90440:()=>{},97583:(e,t,a)=>{"use strict";a.d(t,{FM:()=>i,LS:()=>r,X8:()=>m,Zt:()=>n,bl:()=>l,v8:()=>d});let i=`
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
`,n=`
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
`,l=`
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
`,d=`
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
`,r=`
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
`,m=`
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
`}}]);