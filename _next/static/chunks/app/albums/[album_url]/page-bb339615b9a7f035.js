(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[217],{180:()=>{},1795:(e,t,a)=>{"use strict";a.d(t,{default:()=>C});var i=a(95155),n=a(12115),l=a(3932),s=a(76949),d=a(15204);a(6874);var r=a(3059),u=a(82906),o=a(45123),m=a(51589),c=a(8407),p=a(97583),g=a(90290),h=a(36209),b=a(1701),f=a(4178);function y(e){let{img_obj:t,className:a}=e,s=`https://${o.A.getValue("imageDeliveryHost")}/public`,d=`${s}/${t.id}-${t.filename}`.replaceAll(" ","%20"),[r,u]=(0,n.useState)(),m=0,c=()=>{fetch(`${d}?width=1920`).then(e=>{if(429===e.status&&m<4){console.warn("Image request failed with 429 status code. Retrying..."),m++,setTimeout(c,1e3);return}if(e.ok)return e.blob();throw Error(`Image request failed with status code ${e.status}`)}).then(e=>{u(URL.createObjectURL(e))}).catch(e=>{console.error(e)})};return((0,n.useEffect)(()=>{c()}),r)?(0,i.jsx)("picture",{children:(0,i.jsx)("img",{src:r,className:a,loading:"lazy",alt:d})}):(0,i.jsx)(l.fs,{role:"loading",children:(0,i.jsx)("span",{className:"visually-hidden",children:"Loading..."})})}a(58561);let x=(0,s.D)({authMode:"apiKey"}),A=(0,s.D)({authMode:"userPool"}),I=[0,350,750,1200];function w(e){let{setFeaturedImg:t,selectedAlbum:a,editMode:s=!1,signedIn:d=!1}=e,u=o.A.getValue("imageDeliveryHost"),m=(0,n.useRef)(!1),[w,_]=(0,n.useState)(!1),[j,v]=(0,n.useState)(0),[k,$]=(0,n.useState)([]),[T,N]=(0,n.useState)(-1),[D,C]=(0,n.useState)(!1),S=(0,n.useCallback)(async()=>{if(!m.current&&null!==T){C(!0),m.current=!0;try{let e={albumsID:a.id,limit:4};-1!==T&&(e.nextToken=T);let t=await x.graphql({query:p.LS,variables:e});if(!t||!t.data){console.error("Error fetching data",t),C(!1);return}let i=t.data.imagesByAlbumsID.items.map((e,t)=>(e.index=t,e));$(e=>[...e,...i]),N(t.data.imagesByAlbumsID.nextToken)}catch(e){console.error("Error fetching data",e)}finally{C(!1),m.current=!1;return}}},[T,a.id]);async function q(e){let t=k.filter(t=>t.id!==e.id);await (0,c.T)({key:`${e.id}-${e.filename}`}),await A.graphql({query:r.KK,variables:{input:{id:e.id}}}),console.log(`image with ID ${e.id} is deleted from album`),$(t)}if((0,n.useEffect)(()=>{-1===T&&a.id&&0===k.length&&!m.current&&S()},[T,a.id,k.length,S]),0===k.length&&null!==T)return;if(0===k.length&&null===T)return(0,i.jsx)("div",{className:"text-center",children:"No images found for this album"});let E=k.map(e=>{let t=`${e.id}-${e.filename}`.replaceAll(" ","%20");return{src:`https://${u}/public/${e.id}-${e.filename}`,alt:e.filename,downloadUrl:`https://${u}/public/${t}`,width:e.width,height:e.height}});function F(e){if(q&&s)return(0,i.jsx)(l.al,{floating:!0,className:"position-absolute top-0 end-0 btn-light m-1",onClick:()=>{var t;return t=e.image,void(window.confirm("Are you sure you want to delete this image?")&&q(t))},color:"text-dark","data-mdb-toggle":"tooltip",title:"Delete photo",children:(0,i.jsx)(l.$u,{fas:!0,icon:"times text-dark",size:"2x"})})}function M(e){if(t&&s)return a.albumsFeaturedImageId&&e.image.id===a.albumsFeaturedImageId?(0,i.jsx)(l.al,{floating:!0,className:"position-absolute bottom-0 end-0 btn-light m-1",title:"Set Featured",disabled:!0,MDBColor:"text-dark","data-mdb-toggle":"tooltip",children:(0,i.jsx)(l.$u,{fas:!0,icon:"star text-dark",size:"2x"})}):(0,i.jsx)(l.al,{floating:!0,className:"position-absolute bottom-0 end-0 btn-light m-1",onClick:()=>t(e),MDBColor:"text-dark","data-mdb-toggle":"tooltip",title:"Set Featured",children:(0,i.jsx)(l.$u,{far:!0,icon:"star text-dark",size:"2x"})})}let U=k.map((e,t)=>(0,i.jsx)("div",{className:"m-0 p-1",children:(0,i.jsxs)("div",{className:"bg-image hover-overlay position-relative",children:[(0,i.jsx)(y,{img_obj:e,className:"img-fluid shadow-4",alt:e.filename}),(0,i.jsx)("a",{type:"button",children:(0,i.jsx)("div",{className:"mask overlay",onClick:()=>(_(!0),v(e.index)),style:{backgroundColor:"rgba(0, 0, 0, 0.2)"}})}),(0,i.jsx)(F,{image:e}),(0,i.jsx)(M,{image:e})]})},t));return(0,i.jsxs)("div",{className:"d-flex photo-album",children:[(0,i.jsx)(g.A,{items:U,breakpoints:I,loadNextItems:S,isLoading:D,setIsLoading:C}),(0,i.jsx)(h.Yf,{index:j,slides:E,close:()=>_(!1),open:w,controller:{closeonBackDropClick:!0},styles:{container:{backgroundColor:"rgba(0, 0, 0, .5)"}},plugins:d?[b.A,f.A]:[f.A],on:{view:e=>{let{index:t}=e;return v(t)}},zoom:{maxZoomPixelRatio:1},render:{iconZoomIn:()=>{},iconZoomOut:()=>{}}})]})}var _=a(35695),j=a(48256),v=a(42955),k=a(89118);let $=(0,s.D)({authMode:"userPool"}),T=(0,s.D)({authMode:"apiKey"});function N(e){let{album_url:t,setEditMode:a}=e,[s,d]=(0,n.useState)([]),[o,g]=(0,n.useState)(!1),[h,b]=(0,n.useState)(!1),[f,y]=(0,n.useState)([]),[x,A]=(0,n.useState)(!1),[I,w]=(0,n.useState)([]),[N,D]=(0,n.useState)(0),C=(0,_.useRouter)(),[S,q]=(0,n.useState)(null);async function E(e){d(e.target.files)}async function F(){let e=await (0,u.KN)(t);q(e),w(Object.fromEntries(e.albumtagss.items.map((e,t)=>[e.albumTagsId,t])))}async function M(e){if(e.preventDefault(),b(!0),o)return void b(!1);try{let t=new FormData(e.target),i=t.get("date")+"T00:00:00.000Z",n={id:S.id,title:t.get("title"),desc:t.get("desc"),date:i},l=(await $.graphql({query:r.AP,variables:{input:n}})).data.updateAlbums;try{await $.graphql({query:r.Pi,variables:{input:{id:(0,u.sL)(S)}}})}catch(e){console.warn("Failed to delete old url object during update. Continuing...",e)}try{await $.graphql({query:r.cO,variables:{input:{id:(0,u.sL)(l),urlAlbumId:l.id}}})}catch(e){console.error("New url object not created during update. This might be critical.",e)}s.length>0&&await (0,k.A)(l,s,D),console.log(`Successfully updated album: ${t.get("title")}`),a(!1)}catch(e){console.error("Error updating album:",e)}finally{b(!1)}}async function U(e){e.preventDefault(),a(!1),C.push(`/albums/${(0,u.sL)(S)}`)}async function L(e){if(g(!0),!window.confirm("Are you sure you want to delete this album?"))return;let t=await T.graphql({query:p.LS,variables:{albumsID:e}}),a=await T.graphql({query:p.Zt,variables:{id:e}});t.data.imagesByAlbumsID.items.map(async e=>{await (0,c.T)({key:`${e.id}-${e.filename}`}),await $.graphql({query:r.KK,variables:{input:{id:e.id}}})}),await $.graphql({query:r.yd,variables:{input:{id:e}}});let i=(0,u.sL)(a.data.getAlbums);await $.graphql({query:r.Pi,variables:{input:{id:i}}}),console.log("album successfully deleted"),C.push("/")}async function K(){y(await (0,v.Mp)())}async function P(e){for(let t=0;t<f.length;t++)if(f[t].title.toUpperCase()===e.toUpperCase())return void alert("Cannot create duplicate tags!");await $.graphql({query:r.J_,variables:{input:{title:e,privacy:"public"}}}),K()}async function z(e){let t={albumsId:S.id,albumTagsId:e.id};await $.graphql({query:r.fF,variables:{input:t}})}async function H(e){let t={id:S.albumtagss.items[I[e.id]].id};await $.graphql({query:r.cD,variables:{input:t}})}if((0,n.useEffect)(()=>{new m.A().isAdmin(A)},[]),(0,n.useEffect)(()=>{if(S||(F(),K()),!x)return}),!S)return(0,i.jsx)(l.fs,{className:"m-3"});let O=new Date(S.date),R=O.getDate(),B=R<10?"0".concat(R):String(R),V=O.getMonth()+1,Z=V<10?"0".concat(V):String(V),W=String(O.getFullYear()).concat("-",Z,"-",B);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("form",{onSubmit:M,children:[(0,i.jsxs)(l.gU,{className:"p-2 d-flex justify-content-center",children:[(0,i.jsxs)(l.m6,{xl:"3",lg:"5",md:"6",children:[(0,i.jsx)(l.gk,{className:"mb-3",label:"Title",name:"title",type:"text",defaultValue:S.title}),(0,i.jsx)(l.gk,{className:"mb-3",label:"Date",name:"date",type:"date",defaultValue:W})]}),(0,i.jsxs)(l.m6,{xl:"3",lg:"5",md:"6",children:[(0,i.jsx)(l.SM,{className:"mb-3",label:"Description",name:"desc",type:"text",rows:3,defaultValue:S.desc}),(0,i.jsx)(l.C,{id:"file_upload",multiple:!0,onChange:E,className:"flex-grow-1"})]})]}),(0,i.jsx)(l.gU,{className:"d-flex justify-content-center align-items-center",children:(0,i.jsxs)(l.m6,{className:"d-flex justify-content-center",lg:"5",children:[(0,i.jsx)(l.al,{className:"m-1",title:"Delete Album",onClick:()=>L(S.id),color:"dark","data-mdb-toggle":"tooltip",children:"Delete Album"}),(0,i.jsx)(l.al,{type:"submit",className:"bg-dark m-1",children:"Save"}),(0,i.jsx)(l.al,{className:"bg-dark m-1",onClick:U,children:"Cancel"})]})}),h?(0,i.jsx)(function(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(l.fs,{className:"mt-3"}),s.length>0?(0,i.jsxs)("p",{className:"fw-light",children:["Saving album and uploading image ",N," of ",s.length]}):(0,i.jsx)("p",{className:"fw-light",children:"Saving album"})]})},{}):(0,i.jsx)(i.Fragment,{})]}),(0,i.jsx)(l.gU,{className:"pt-2 d-flex justify-content-center align-items-center",children:(0,i.jsxs)(l.m6,{className:"d-flex justify-content-center flex-wrap",lg:"5",children:[f.map((e,t)=>(0,i.jsx)(j.A,{selected:e.id in I,name:e.title,onSelect:()=>z(f[t]),onDeselect:()=>H(f[t])},t)),(0,i.jsx)("div",{className:"m-1",style:{minWidth:"60px"},children:(0,i.jsx)(l.gk,{label:"New Tag (press enter to create)",id:"newTag",type:"text",className:"rounded",size:"sm",onKeyDown:e=>{"Enter"===e.key&&(console.log(`enter key pressed, tag name is ${e.target.value}`),P(e.target.value),e.target.value="")}})})]})})]})}let D=(0,s.D)({authMode:"userPool"});function C(e){let{album_url:t}=e,[a,s]=(0,n.useState)(null),[c,p]=(0,n.useState)(!1),[g,h]=(0,n.useState)(!1),[b,f]=(0,n.useState)(!1),y=(0,d.A)(e=>[e.authStatus.authStatus]);async function x(e){let t={id:a.id,albumsFeaturedImageId:e.image.id};s((await D.graphql({query:r.AP,variables:{input:t}})).data.updateAlbums)}if((0,n.useEffect)(()=>{new m.A().isAdmin(e=>{h(e),p(e)})},[y.authStatus,t]),(0,n.useEffect)(()=>{(0,u.KN)(t).then(e=>{s(e)})},[t]),!a)return(0,i.jsx)("div",{className:"d-flex align-items-end",style:{height:"400px"},children:(0,i.jsx)("div",{style:{background:"linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))",width:"100%"},className:"d-flex align-items-end",children:(0,i.jsx)(l.Dj,{children:(0,i.jsxs)("div",{className:"text-justify-start text-light placeholder-glow",children:[(0,i.jsxs)("div",{className:"ms-3 d-flex justify-items-start align-items-end",children:[(0,i.jsx)("h2",{className:"p-0 d-inline-block text-start placeholder col-7",children:"Placeholder"}),(0,i.jsx)("div",{className:"vr ms-2 me-2 ",style:{height:"40px"}}),(0,i.jsx)("h5",{className:"p-1 d-inline-block text-start placeholder col-3",children:"Placeholder"})]}),(0,i.jsx)("p",{className:"text-start ms-3 me-3 placeholder col-9"})]})})})});let A=new Date(a.date);function I(){return g?(0,i.jsx)(l.al,{floating:!0,onClick:()=>f(!0),color:"light",className:"m-2",children:(0,i.jsx)(l.$u,{far:!0,icon:"edit"})}):null}return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(function(){let e,[t,s]=(0,n.useState)({width:void 0,height:void 0});(0,n.useEffect)(()=>{let e=()=>{s({width:window.innerWidth,height:window.innerHeight})};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]);let d=[0,750,1200,1920],r=function(){let e=t.width;for(let t=d.length-2;t>=0;t--)if(d[t]<e)return d[t+1]}(),u=a.featuredImage?a.featuredImage.height/a.featuredImage.width:1,m="number"!=typeof r||isNaN(r)?d[d.length-1]:r,c=a.featuredImage?`https://${o.A.getValue("imageDeliveryHost")}/public/${a.featuredImage.id}-${a.featuredImage.filename}?width=${m}`:"",p={backgroundImage:`url(${c})`,backgroundAttachment:"fixed",backgroundPosition:"top",backgroundRepeat:"no-repeat",minHeight:Math.max(200,isNaN(e="number"!=typeof t.width||isNaN(t.width)?300:Math.min(t.width*u,400))?200:e),backgroundSize:""};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"d-flex align-items-end",style:p,children:(0,i.jsxs)("div",{style:{background:"linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))",width:"100%"},className:"d-flex align-items-end",children:[(0,i.jsx)(I,{}),(0,i.jsx)(l.Dj,{children:(0,i.jsx)("div",{className:"text-justify-start text-light",children:(0,i.jsxs)("div",{className:"ms-3 d-flex justify-items-start align-items-end",children:[(0,i.jsx)("h2",{className:"p-0 d-inline-block text-start ",children:a.title}),(0,i.jsx)("div",{className:"vr ms-2 me-2 ",style:{height:"40px"}}),(0,i.jsxs)("h5",{className:"p-1 d-inline-block text-start",children:[A.getMonth()+1,"/",A.getDate(),"/",A.getFullYear()]})]})})})]})}),(0,i.jsx)(l.Dj,{breakpoint:"xl",children:(0,i.jsx)("p",{className:"text-start ms-1 me-1 mt-2 p-1",children:a.desc})})]})},{}),b?(0,i.jsx)(N,{album_url:t,setEditMode:function(e){f(e),(0,u.KN)(t).then(e=>{s(e)})}}):(0,i.jsx)(i.Fragment,{}),(0,i.jsx)(l.Dj,{breakpoint:"xl",children:(0,i.jsx)(w,{setFeaturedImg:x,selectedAlbum:a,editMode:b,signedIn:"authenticated"===y.authStatus})})]})}},3059:(e,t,a)=>{"use strict";a.d(t,{AP:()=>s,J_:()=>i,KK:()=>u,Km:()=>n,LF:()=>l,Pi:()=>m,cD:()=>p,cO:()=>o,fF:()=>c,r0:()=>r,yd:()=>d});let i=`
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
`,l=`
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
`,d=`
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
`,r=`
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
`,u=`
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
`,o=`
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
`,m=`
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
`},23422:(e,t,a)=>{Promise.resolve().then(a.bind(a,1795))},31668:()=>{},48256:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});var i=a(95155),n=a(12115),l=a(3932);function s(e){let{selected:t=!1,onSelect:a=()=>{},onDeselect:s=()=>{},name:d}=e,[r,u]=(0,n.useState)(t);function o(){r?(u(!1),s()):(u(!0),a())}return r?(0,i.jsxs)(l.al,{rounded:!0,className:"text-light m-1",size:"sm",color:"dark",onClick:()=>o(),children:[d,"  ",(0,i.jsx)(l.$u,{className:"text-white-50",icon:"times"})]}):(0,i.jsx)(l.al,{rounded:!0,outline:!0,onClick:()=>o(),className:"text-dark m-1",size:"sm",color:"dark",children:d})}},51589:(e,t,a)=>{"use strict";a.d(t,{A:()=>l});var i=a(53732);class n{async setTokens(){this.loading=!0;let{accessToken:e,idToken:t}=(await (0,i.$)()).tokens??{};this.accessToken=e,this.idToken=t,this.loading=!1}async isAdmin(e){await this.setTokens(),this.accessToken&&this.accessToken.payload["cognito:groups"]&&"portfolio_admin"===this.accessToken.payload["cognito:groups"][0]?e(!0):e(!1)}async userName(e){await this.setTokens(),this.idToken?e(this.idToken.payload["cognito:username"]):e(null)}constructor(){this.accessToken=null,this.idToken=null,this.loading=!1}}let l=n},89118:(e,t,a)=>{"use strict";a.d(t,{A:()=>d});var i=a(76949),n=a(16078),l=a(3059);let s=(0,i.D)();async function d(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>{},i=["image/gif","image/jpeg","image/png"],d=0;async function r(t){if(!i.includes(t.type))return void console.warn(`file ${t.name} is not a valid file type!`);let r="",u={},o="";try{let i=new Image;i.src=window.URL.createObjectURL(t),await i.decode();let m=[i.naturalHeight,i.naturalWidth],c={title:t.name,desc:"",filename:t.name,date:new Date().toISOString(),albumsID:e.id,height:m[0],width:m[1]};try{let e=await s.graphql({query:l.r0,variables:{input:c}});r=(u=e?.data?.createImages).id,o=`${u.id}-${t.name}`}catch(e){console.warn("Error creating image: ",t.name,e);return}try{await (0,n.C)({key:o,data:t})}catch(e){console.warn("Image not uploaded. Error: ",e),await s.graphql({query:l.KK,variables:{input:{id:r}}});return}d+=1,a(d)}catch(e){console.warn("Error uploading image: ",t.name,e);return}console.log(`${t.name} sucessfully uploaded`)}if(t.length>0){let e=Array.from(t);console.log("starting uploads"),await Promise.all(e.map(e=>r(e))),console.log("All images uploaded!")}}},90290:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});var i=a(95155),n=a(12115),l=a(3932);function s(e){let{items:t,breakpoints:a,loadNextItems:s=()=>{},isLoading:d=!0,setIsLoading:r=()=>{}}=e,[u,o]=(0,n.useState)({width:void 0,height:void 0}),[m,c]=(0,n.useState)(0),p=(0,n.useRef)(null),g=(0,n.useRef)();(0,n.useEffect)(()=>{c(g.current.offsetTop)},[]),(0,n.useEffect)(()=>{if("undefined"==typeof IntersectionObserver)return;let e=new IntersectionObserver(e=>{e[0].isIntersecting&&s()}),t=p.current;return t&&!d&&e.observe(t),()=>{t&&e.unobserve(t)}},[d,s]),(0,n.useEffect)(()=>{let e=()=>{o({width:window.innerWidth,height:window.innerHeight})};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]);let h=function(){if(void 0===u.width)return 1;let e=u.width;for(let t=a.length-1;t>=0;t--)if(a[t]<e)return t}(),b=Array(h);for(let e=0;e<t.length;e++){let a=t[e],i=e%h;b[i]||(b[i]=[]),b[i].push(a)}return(0,i.jsxs)("div",{ref:g,children:[(0,i.jsx)(l.gU,{className:"m-1",style:{minHeight:`calc(100vh-${m}`},children:b.map((e,t)=>(0,i.jsx)(l.m6,{className:"column p-0",children:e.map(e=>e)},t))}),(0,i.jsx)("p",{className:"display-block",ref:p})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[496,932,461,78,949,654,28,648,366,441,684,358],()=>t(23422)),_N_E=e.O()}]);