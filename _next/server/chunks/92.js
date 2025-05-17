"use strict";exports.id=92,exports.ids=[92],exports.modules={18092:(e,t,a)=>{a.d(t,{A:()=>n});var l=a(60687),i=a(43210),s=a(22102);function n({items:e,breakpoints:t,loadNextItems:a=()=>{},isLoading:n=!0,setIsLoading:d=()=>{}}){let[m,r]=(0,i.useState)({width:void 0,height:void 0}),[u,c]=(0,i.useState)(0),o=(0,i.useRef)(null),g=(0,i.useRef)(),b=function(){if(void 0===m.width)return 1;let e=m.width;for(let a=t.length-1;a>=0;a--)if(t[a]<e)return a}(),p=Array(b);for(let t=0;t<e.length;t++){let a=e[t],l=t%b;p[l]||(p[l]=[]),p[l].push(a)}return(0,l.jsxs)("div",{ref:g,children:[(0,l.jsx)(s.gU,{className:"m-1",style:{minHeight:`calc(100vh-${u}`},children:p.map((e,t)=>(0,l.jsx)(s.m6,{className:"column p-0",children:e.map(e=>e)},t))}),(0,l.jsx)("p",{className:"display-block",ref:o})]})}},31336:(e,t,a)=>{a.d(t,{KN:()=>d,sL:()=>n});var l=a(98654),i=a(41040);let s=(0,l.D)({authMode:"apiKey"});function n(e){let t=e.id.slice(-2);return e.title.toLowerCase().replace(" ","-").concat("-",t)}async function d(e){let t=decodeURIComponent(e);try{return(await s.graphql({query:i.ID,variables:{id:t}})).data.getUrl.album}catch(e){throw console.error(e),Error("Album not found, "+e)}}},35921:(e,t,a)=>{a.d(t,{Mp:()=>n,yy:()=>d});var l=a(98654),i=a(77466);let s=(0,l.D)({authMode:"apiKey"});async function n(){return(await s.graphql({query:i.FM})).data.listAlbumTags.items}async function d(){return(await s.graphql({query:i.FM,variables:{filter:{privacy:{eq:"public"}}}})).data.listAlbumTags.items}},41040:(e,t,a)=>{a.d(t,{$3:()=>s,ID:()=>i,X8:()=>l});let l=`
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
`,s=`
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

`},45211:(e,t,a)=>{a.d(t,{A:()=>p});var l=a(60687),i=a(43210),s=a(98654),n=a(22102),d=a(85814),m=a.n(d),r=a(87632),u=a(18092),c=a(41040),o=a(31336);a(35921);var g=a(36539);let b=(0,s.D)({authMode:"apiKey"});function p(){let[e,t]=(0,i.useState)([]),[a,s]=(0,i.useState)([]),[d,p]=(0,i.useState)([]),[y,x]=(0,i.useState)({}),[A,h]=(0,i.useState)(!1),[I,f]=(0,i.useState)({width:void 0,height:void 0}),T=[0,350,750,1200],_=function(){let e=I.width;for(let t=T.length-1;t>=0;t--)if(T[t]<e)return t}(),$=I.width<750?-1:I.width<=992?2*I.width/6:.833*I.width*.6667/_,k=$<0?{}:{height:$,objectFit:"cover"};async function D(){h(!0);let e=await b.graphql({query:c.$3,variables:{limit:8}});p(e.data.albumByDate.nextToken),s(e.data.albumByDate.items),h(!1)}let v=(0,i.useCallback)(async()=>{if(!A&&d){if(h(!0),Object.keys(y).length<1){let e=await b.graphql({query:c.$3,variables:{limit:4,nextToken:d}});p(t=>e.data.albumByDate.nextToken),s(t=>[...t,...e.data.albumByDate.items])}else{let e=await b.graphql({query:c.X8,variables:{albumTagsId:y[0],limit:2,nextToken:d}}),t=e.data.albumTagsAlbumsByAlbumTagsId.items;p(t=>e.data.albumTagsAlbumsByAlbumTagsId.nextToken),s(e=>[...e,...t.map(e=>e.albums)])}h(!1)}},[d,A,y]);async function j(a){h(!0);let l=Object.keys(a);if(l.length<1)D(),t(e.map(e=>({...e,visible:!0,selected:!1})));else{let i=await b.graphql({query:c.X8,variables:{limit:8,albumTagsId:a[l[0]]}}),n=i.data.albumTagsAlbumsByAlbumTagsId.items;p(i.data.albumTagsAlbumsByAlbumTagsId.nextToken),t(e.map(e=>e.index in a?{...e,visible:!0,selected:!0}:{...e,visible:!1})),x(a),s(n.map(e=>e.albums).sort((e,t)=>{let a=new Date(e.date);return new Date(t.date)-a}))}h(!1)}async function w(e){j({...y,[e.index]:e.id})}async function q(e){delete y[e.index],j(y)}function N({tags:e}){return e.length<1?(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(r.A,{name:"____"})}):(0,l.jsx)("div",{className:"p-1 pb-0",children:e.map(e=>e.visible?(0,l.jsx)(r.A,{selected:e.selected,name:e.title,onSelect:()=>w(e),onDeselect:()=>q(e)},e.id):(0,l.jsx)(l.Fragment,{}))})}let F=[1,2,3,4,5,6].map((e,t)=>(0,l.jsxs)(n.kv,{background:"dark",className:"text-white m-1 mb-2 bg-image hover-overlay",alignment:"end",children:[(0,l.jsx)(n.H1,{overlay:!0,src:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",alt:"...",style:k,className:""}),(0,l.jsxs)(n.yy,{style:{background:"linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))"},children:[(0,l.jsx)(n.gw,{children:(0,l.jsx)("span",{className:"placeholder col-7"})}),(0,l.jsx)(n.tV,{children:(0,l.jsx)("span",{className:"placeholder col-3"})})]}),(0,l.jsx)("div",{className:"mask overlay",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}})]},t));if(!a)return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.gU,{className:"me-0 mt-0",children:(0,l.jsx)(n.m6,{className:"d-flex justify-items-start",children:(0,l.jsx)(N,{tags:e})})}),(0,l.jsx)(u.A,{items:F,breakpoints:T})]});let S=a.map((e,t)=>(0,l.jsx)(m(),{href:`/albums/${(0,o.sL)(e)}`,className:"text-light text-decoration-none",children:(0,l.jsxs)(n.kv,{background:"dark",className:"text-white m-1 mb-2 bg-image hover-overlay",alignment:"end",children:[(0,l.jsx)(n.H1,{overlay:!0,src:`https://${g.A.getValue("imageDeliveryHost")}/public/${e.featuredImage?e.featuredImage.id:""}-${e.featuredImage?e.featuredImage.filename:""}?width=1920`,alt:"...",style:k,className:""}),(0,l.jsxs)(n.yy,{style:{background:"linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))"},children:[(0,l.jsx)(n.gw,{children:e.title}),e.desc.length>0?(0,l.jsx)(n.tV,{className:"text-truncate",children:e.desc}):(0,l.jsx)(l.Fragment,{}),(0,l.jsx)(n.tV,{children:function(e){let t=new Date(e);return`${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`}(e.date)})]}),(0,l.jsx)("div",{className:"mask overlay",style:{backgroundColor:"rgba(0, 0, 0, 0.3)"}})]})},t));return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.gU,{className:"me-0",children:(0,l.jsx)(n.m6,{className:"d-flex justify-items-start",children:(0,l.jsx)(N,{tags:e})})}),(0,l.jsx)("div",{className:"d-flex",children:(0,l.jsx)(u.A,{items:S,breakpoints:T,loadNextItems:v,isLoading:A,setIsLoading:h})})]})}},77466:(e,t,a)=>{a.d(t,{FM:()=>l,LS:()=>d,X8:()=>m,Zt:()=>i,bl:()=>s,v8:()=>n});let l=`
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
`,s=`
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
`,n=`
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
`,d=`
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
`},78162:(e,t,a)=>{a.r(t),a.d(t,{default:()=>i});var l=a(31658);let i=async e=>[{type:"image/png",sizes:"192x192",url:(0,l.fillMetadataSegment)(".",await e.params,"icon.png")+"?de3b7f245c4a07f6"}]},87632:(e,t,a)=>{a.d(t,{A:()=>n});var l=a(60687),i=a(43210),s=a(22102);function n({selected:e=!1,onSelect:t=()=>{},onDeselect:a=()=>{},name:n}){let[d,m]=(0,i.useState)(e);function r(){d?(m(!1),a()):(m(!0),t())}return d?(0,l.jsxs)(s.al,{rounded:!0,className:"text-light m-1",size:"sm",color:"dark",onClick:()=>r(),children:[n,"  ",(0,l.jsx)(s.$u,{className:"text-white-50",icon:"times"})]}):(0,l.jsx)(s.al,{rounded:!0,outline:!0,onClick:()=>r(),className:"text-dark m-1",size:"sm",color:"dark",children:n})}}};