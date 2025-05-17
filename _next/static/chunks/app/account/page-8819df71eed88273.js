(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[298],{3059:(e,t,a)=>{"use strict";a.d(t,{AP:()=>s,J_:()=>n,KK:()=>o,Km:()=>i,LF:()=>d,Pi:()=>r,cD:()=>p,cO:()=>m,fF:()=>c,r0:()=>u,yd:()=>l});let n=`
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
`,s=`
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
`,o=`
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
`,m=`
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
`},11489:(e,t,a)=>{"use strict";a.d(t,{X:()=>I});var n=a(58563),i=a(46199),d=a(61261);a(59928),a(90440);var s=a(16218),l=a(8352),u=a(99896),o=a(2954),m=a(28193),r=a(85654),c=a(79109);a(28716),a(59340);var p=a(92868),g=a(60718);let b=async(e,t)=>{let a=new u.o(t.url.toString());return(0,g.Nt)(!!e.Key,"Key"),a.pathname=(0,g.DB)(a,e.Key),{method:"GET",headers:{...e.Range&&{Range:e.Range}},url:a}},A=async e=>{if(!(e.statusCode>=300))return{...(0,p.Tj)(e.headers,{DeleteMarker:["x-amz-delete-marker",p.OI],AcceptRanges:"accept-ranges",Expiration:"x-amz-expiration",Restore:"x-amz-restore",LastModified:["last-modified",p.El],ContentLength:["content-length",p.vv],ETag:"etag",ChecksumCRC32:"x-amz-checksum-crc32",ChecksumCRC32C:"x-amz-checksum-crc32c",ChecksumSHA1:"x-amz-checksum-sha1",ChecksumSHA256:"x-amz-checksum-sha256",MissingMeta:["x-amz-missing-meta",p.vv],VersionId:"x-amz-version-id",CacheControl:"cache-control",ContentDisposition:"content-disposition",ContentEncoding:"content-encoding",ContentLanguage:"content-language",ContentRange:"content-range",ContentType:"content-type",Expires:["expires",p.El],WebsiteRedirectLocation:"x-amz-website-redirect-location",ServerSideEncryption:"x-amz-server-side-encryption",SSECustomerAlgorithm:"x-amz-server-side-encryption-customer-algorithm",SSECustomerKeyMD5:"x-amz-server-side-encryption-customer-key-md5",SSEKMSKeyId:"x-amz-server-side-encryption-aws-kms-key-id",BucketKeyEnabled:["x-amz-server-side-encryption-bucket-key-enabled",p.OI],StorageClass:"x-amz-storage-class",RequestCharged:"x-amz-request-charged",ReplicationStatus:"x-amz-replication-status",PartsCount:["x-amz-mp-parts-count",p.vv],TagCount:["x-amz-tagging-count",p.vv],ObjectLockMode:"x-amz-object-lock-mode",ObjectLockRetainUntilDate:["x-amz-object-lock-retain-until-date",p.El],ObjectLockLegalHoldStatus:"x-amz-object-lock-legal-hold"}),Metadata:(0,p.nl)(e.headers),$metadata:(0,l.j)(e),Body:e.body};{let t=await (0,r.V)(e);throw(0,p.Pu)(t,e.statusCode)}},y=(0,o.A)(c.o,b,A,{...m.sb,responseType:"blob"});var h=a(26734),_=a(17704);let I=e=>{let t=new AbortController;return(0,s.k)({job:x(e,t.signal),onCancel:e=>{t.abort(e)}})},x=({options:e,key:t},a)=>async()=>{let{bucket:s,keyPrefix:l,s3Config:u}=await (0,d.a)(n.H,e),o=l+t;_.v.debug(`download ${t} from ${o}.`);let{Body:m,LastModified:r,ContentLength:c,ETag:p,Metadata:g,VersionId:b,ContentType:A}=await y({...u,abortSignal:a,onDownloadProgress:e?.onProgress,userAgentValue:(0,h.B)(i.sZ.DownloadData)},{Bucket:s,Key:o,...e?.bytesRange&&{Range:`bytes=${e.bytesRange.start}-${e.bytesRange.end}`}});return{key:t,body:m,lastModified:r,size:c,contentType:A,eTag:p,metadata:g,versionId:b}}},51589:(e,t,a)=>{"use strict";a.d(t,{A:()=>d});var n=a(53732);class i{async setTokens(){this.loading=!0;let{accessToken:e,idToken:t}=(await (0,n.$)()).tokens??{};this.accessToken=e,this.idToken=t,this.loading=!1}async isAdmin(e){await this.setTokens(),this.accessToken&&this.accessToken.payload["cognito:groups"]&&"portfolio_admin"===this.accessToken.payload["cognito:groups"][0]?e(!0):e(!1)}async userName(e){await this.setTokens(),this.idToken?e(this.idToken.payload["cognito:username"]):e(null)}constructor(){this.accessToken=null,this.idToken=null,this.loading=!1}}let d=i},64867:(e,t,a)=>{Promise.resolve().then(a.bind(a,78494))},78494:(e,t,a)=>{"use strict";a.d(t,{default:()=>I});var n=a(95155),i=a(12115),d=a(76949),s=a(3932),l=a(15204),u=a(35695),o=a(42955),m=a(3059),r=a(97583),c=a(51589),p=a(45123);a(82906);let g=(0,d.D)({authMode:"apiKey"}),b=(0,d.D)({authMode:"userPool"}),A=async e=>{let t=new Image;return t.src=e,await t.decode(),[t.naturalHeight,t.naturalWidth]};async function y(e){let t={id:e.id,type:"Album"};console.log(e);let a=await b.graphql({query:m.AP,variables:{input:t}});a&&(console.log(a),console.log(`upgraded ${e.id}`))}async function h(){var e=null;let t=await g.graphql({query:r.bl,variables:{limit:10}});for(e=t.data.listAlbums.nextToken,await Promise.all(t.data.listAlbums.items.map(e=>y(e)));e;){let t=await g.graphql({query:r.bl,variables:{limit:10,nextToken:e}});e=t.data.listAlbums.nextToken,await Promise.all(t.data.listAlbums.items.map(e=>y(e)))}console.log("all albums upgraded")}let _=(0,d.D)();function I(){let e=(0,l.A)(e=>[e.authStatus]),[t,a]=(0,i.useState)(!1),[d,g]=(0,i.useState)([]);async function b(){g(await (0,o.yy)())}async function A(e){window.confirm(`Are you sure you want to delete the tag ${e.title}?`)&&(g(d.filter(t=>t.id!==e.id)),(await _.graphql({query:r.X8,variables:{albumTagsId:e.id}})).data.albumTagsAlbumsByAlbumTagsId.items.map(async e=>{await _.graphql({query:m.cD,variables:{input:{id:e.id}}})}),await _.graphql({query:m.Km,variables:{input:{id:e.id}}}),console.log("tag deleted"))}async function y(e){e.preventDefault();let t=new FormData(e.target).get("inlineRadio");console.log(t),p.A.setCurrentEnvironment(t),p.A.save()}(0,i.useEffect)(()=>{let e=new c.A;b(),e.isAdmin(a)},[e.authStatus]);let{signOut:I}=(0,l.A)(e=>[e.user]);return"unauthenticated"===e.authStatus&&(0,u.redirect)("/signin"),(0,n.jsxs)(s.Dj,{children:[(0,n.jsx)("h4",{className:"mt-2",children:" Manage Account Here"}),t?(0,n.jsx)(function(){return(0,n.jsxs)(s.m6,{md:"3",lg:"2",sm:"5",className:"ms-auto me-auto",children:[(0,n.jsx)("hr",{className:"hr"}),(0,n.jsx)("p",{className:"mt-1",children:"Manage Tags"}),(0,n.jsx)(s.lC,{light:!0,children:d.map(e=>(0,n.jsxs)(s._N,{className:"d-flex",children:[(0,n.jsx)("p",{className:"w-100",children:e.title}),(0,n.jsx)(s.al,{tag:"a",color:"none",style:{color:"#000000"},onClick:()=>{A(e)},children:(0,n.jsx)(s.$u,{className:"",fas:!0,icon:"trash"})})]},e.id))}),(0,n.jsx)("p",{className:"mt-1",children:"Change current environment"}),(0,n.jsxs)("form",{className:"m-1",onSubmit:y,children:["dev"===p.A.getCurrentEnvironment()?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.Zq,{name:"inlineRadio",value:"dev",label:"dev",inline:!0,defaultChecked:!0}),(0,n.jsx)(s.Zq,{name:"inlineRadio",value:"staging",label:"staging",inline:!0})]}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.Zq,{name:"inlineRadio",value:"dev",label:"dev",inline:!0}),(0,n.jsx)(s.Zq,{name:"inlineRadio",value:"staging",label:"staging",inline:!0,defaultChecked:!0})]}),(0,n.jsx)(s.al,{className:"bg-dark m-1",children:"Save"})]}),(0,n.jsx)("hr",{className:"hr"}),(0,n.jsx)(s.al,{className:"bg-dark m-1",onClick:()=>h(),children:"Update DB"})]})},{}):(0,n.jsx)(n.Fragment,{}),(0,n.jsx)(s.al,{className:"bg-dark",onClick:function(){I(),(0,u.redirect)("/signin")},children:"Sign Out"})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[932,461,78,949,654,366,441,684,358],()=>t(64867)),_N_E=e.O()}]);