(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[359],{3059:(e,t,a)=>{"use strict";a.d(t,{AP:()=>l,J_:()=>i,KK:()=>s,Km:()=>n,LF:()=>d,Pi:()=>o,cD:()=>p,cO:()=>r,fF:()=>c,r0:()=>m,yd:()=>u});let i=`
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
`,n=`
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
`,d=`
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
`,l=`
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
`,u=`
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
`,m=`
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
`,r=`
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
`,o=`
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
`,c=`
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
`,p=`
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
`},6141:(e,t,a)=>{Promise.resolve().then(a.bind(a,55018))},14698:()=>{},28716:()=>{},28848:()=>{},35695:(e,t,a)=>{"use strict";var i=a(18999);a.o(i,"redirect")&&a.d(t,{redirect:function(){return i.redirect}}),a.o(i,"useRouter")&&a.d(t,{useRouter:function(){return i.useRouter}}),a.o(i,"useSearchParams")&&a.d(t,{useSearchParams:function(){return i.useSearchParams}})},48013:()=>{},51589:(e,t,a)=>{"use strict";a.d(t,{A:()=>d});var i=a(53732);class n{async setTokens(){this.loading=!0;let{accessToken:e,idToken:t}=(await (0,i.$)()).tokens??{};this.accessToken=e,this.idToken=t,this.loading=!1}async isAdmin(e){await this.setTokens(),this.accessToken&&this.accessToken.payload["cognito:groups"]&&"portfolio_admin"===this.accessToken.payload["cognito:groups"][0]?e(!0):e(!1)}async userName(e){await this.setTokens(),this.idToken?e(this.idToken.payload["cognito:username"]):e(null)}constructor(){this.accessToken=null,this.idToken=null,this.loading=!1}}let d=n},55018:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>b});var i=a(95155),n=a(12115),d=a(76949),l=a(3932),u=a(35695),m=a(3059),s=a(97583),r=a(82906),o=a(89118),c=a(51589);let p=(0,d.D)({authMode:"userPool"});function g(){let e=(0,u.useRouter)(),[t,a]=(0,n.useState)([]),[d,g]=(0,n.useState)("loading"),[b,A]=(0,n.useState)(!1),[_,I]=(0,n.useState)(0),[y,h]=(0,n.useState)(""),T=(0,n.useRef)(!1);async function $(e){a(e.target.files)}async function x(a){a.preventDefault(),A(!0);let i=new FormData(a.target),n=i.get("date")+"T00:00:00.000Z",d=new Date,l="T00:00:00.000Z"===n?d.toISOString():n,u=i.get("title"),c=0===u.length?`Album created at ${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`:u,g=(await p.graphql({query:s.v8,limit:1})).data.listImages.items[0].id,b={title:c,desc:i.get("desc"),date:l,albumsFeaturedImageId:g,type:"Album"},_=(await p.graphql({query:m.LF,variables:{input:b}})).data.createAlbums,y={id:(0,r.sL)(_),urlAlbumId:_.id};try{await p.graphql({query:m.cO,variables:{input:y}})}catch(e){console.log("failed to create url for new album",e),await p.graphql({query:m.yd,variables:{albumId:_.id}}),h("failed to create url for new album. Album deleted")}await (0,o.A)(_,t,I);try{let t=(await p.graphql({query:s.LS,variables:{albumsID:_.id,limit:1}})).data.imagesByAlbumsID.items[0],n={id:_.id,albumsFeaturedImageId:t.id};(await p.graphql({query:m.AP,variables:{input:n}})).data.updateAlbums,console.log(`Created new album named: ${i.get("title")}`),e.push("../"),a.target.reset()}catch(e){console.warn("failed to update featured img for new album. Album still created"),h("failed to update featured img for new album. Album still created"),a.target.reset()}}return((0,n.useEffect)(()=>{new c.A().isAdmin(t=>{g(t),t||e.push("/")})},[e]),(0,n.useEffect)(()=>{"undefined"!=typeof IntersectionObserver&&(T.current=!0)},[]),T.current)?(0,i.jsx)("div",{children:(0,i.jsxs)(l.Dj,{className:"",children:[(0,i.jsx)("h2",{className:"mt-2",children:" Create new album "}),(0,i.jsxs)("form",{id:"createAlbumForm",onSubmit:x,children:[(0,i.jsxs)(l.gU,{className:" justify-content-center",children:[(0,i.jsxs)(l.m6,{xl:"3",lg:"5",md:"6",children:[(0,i.jsx)(l.gk,{className:"mb-3",label:"Title",name:"title",type:"text"}),(0,i.jsx)(l.gk,{className:"mb-3",label:"Date",name:"date",type:"date"})]}),(0,i.jsx)(l.m6,{xl:"3",lg:"5",md:"6",children:(0,i.jsx)(l.SM,{className:"mb-3",label:"Description",name:"desc",type:"text",rows:3})})]}),(0,i.jsx)(l.gU,{className:" justify-content-center",children:(0,i.jsx)(l.m6,{xl:"3",lg:"5",md:"6",children:(0,i.jsx)(l.C,{multiple:!0,onChange:$,className:"m-1 mb-3"})})}),(0,i.jsx)(function(){return t.length<1?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(l.al,{type:"submit",className:"bg-dark m-1",disabled:!0,children:"Create"}),(0,i.jsx)("p",{children:"Select photos to enable create button"})]}):(0,i.jsx)(l.al,{className:"bg-dark m-1",children:"Create"})},{})]}),b?(0,i.jsx)(function(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(l.fs,{className:"mt-3"}),(0,i.jsxs)("p",{className:"fw-light",children:["Creating album and uploading photo ",_," of ",t.length]})]})},{}):(0,i.jsx)(i.Fragment,{}),(0,i.jsx)("p",{children:y})]})}):(0,i.jsx)(i.Fragment,{})}function b(){return(0,i.jsx)(g,{})}},59340:()=>{},67926:()=>{},68295:()=>{},82638:(e,t,a)=>{"use strict";a.d(t,{$3:()=>d,ID:()=>n,X8:()=>i});let i=`
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
`,d=`
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

`},82906:(e,t,a)=>{"use strict";a.d(t,{KN:()=>u,sL:()=>l});var i=a(76949),n=a(82638);let d=(0,i.D)({authMode:"apiKey"});function l(e){let t=e.id.slice(-2);return e.title.toLowerCase().replace(" ","-").concat("-",t)}async function u(e){let t=decodeURIComponent(e);try{return(await d.graphql({query:n.ID,variables:{id:t}})).data.getUrl.album}catch(e){throw console.error(e),Error("Album not found, "+e)}}},88768:()=>{},89118:(e,t,a)=>{"use strict";a.d(t,{A:()=>u});var i=a(76949),n=a(16078),d=a(3059);let l=(0,i.D)();async function u(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>{},i=["image/gif","image/jpeg","image/png"],u=0;async function m(t){if(!i.includes(t.type))return void console.warn(`file ${t.name} is not a valid file type!`);let m="",s={},r="";try{let i=new Image;i.src=window.URL.createObjectURL(t),await i.decode();let o=[i.naturalHeight,i.naturalWidth],c={title:t.name,desc:"",filename:t.name,date:new Date().toISOString(),albumsID:e.id,height:o[0],width:o[1]};try{let e=await l.graphql({query:d.r0,variables:{input:c}});m=(s=e?.data?.createImages).id,r=`${s.id}-${t.name}`}catch(e){console.warn("Error creating image: ",t.name,e);return}try{await (0,n.C)({key:r,data:t})}catch(e){console.warn("Image not uploaded. Error: ",e),await l.graphql({query:d.KK,variables:{input:{id:m}}});return}u+=1,a(u)}catch(e){console.warn("Error uploading image: ",t.name,e);return}console.log(`${t.name} sucessfully uploaded`)}if(t.length>0){let e=Array.from(t);console.log("starting uploads"),await Promise.all(e.map(e=>m(e))),console.log("All images uploaded!")}}},97583:(e,t,a)=>{"use strict";a.d(t,{FM:()=>i,LS:()=>u,X8:()=>m,Zt:()=>n,bl:()=>d,v8:()=>l});let i=`
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
`,d=`
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
`,l=`
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
`,u=`
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
`}},e=>{var t=t=>e(e.s=t);e.O(0,[932,461,78,949,441,684,358],()=>t(6141)),_N_E=e.O()}]);