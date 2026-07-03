import { defineData } from '@aws-amplify/backend';
import type { Backend } from '../backend';

const schema = `type AlbumTags  @model @auth(rules: [{allow: groups, groups: ["portfolio_admin"], provider: userPools}, {allow: public, operations: [read]}])  {
  id: ID!
  title: String
  privacy: String
  AlbumsHaveTags: [Albums] @manyToMany(relationName: "AlbumTagsAlbums")
}

type Albums @model @auth(rules: [{allow: groups, groups: ["portfolio_admin"], provider: userPools}, {allow: public, operations: [read]}]) {
  id: ID!
  title: String 
  type: String! @index(name: "albumByDate", sortKeyFields: ["date"], queryField: "albumByDate")
  desc: String
  date: AWSDateTime 
  Images: [Images] @hasMany(indexName: "byAlbums", fields: ["id"])
  featuredImage: Images @hasOne
  albumtagss: [AlbumTags] @manyToMany(relationName: "AlbumTagsAlbums")
  privacy: String
}

type Images @model @auth(rules: [{allow: groups, groups: ["portfolio_admin"], provider: userPools}, {allow: public, operations: [read]}]) {
  id: ID!
  title: String
  desc: String
  filename: String
  date: AWSDateTime
  albumsID: ID! @index(name: "byAlbums")
  index: Int
  width: Int
  height: Int
  url: String
}

type Url @model @auth(rules: [{allow: groups, groups: ["portfolio_admin"], provider: userPools}, {allow: public, operations: [read]}]) {
 id: ID!
 album: Albums @hasOne
}
 `;

export const data = defineData({
  migratedAmplifyGen1DynamoDbTableMappings: [
    {
      //The "branchName" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
      branchName: 'dev',
      modelNameToTableNameMapping: {
        AlbumTags: 'AlbumTags-jpenhlxtynaxdd2nn27sn7pozm-dev',
        Albums: 'Albums-jpenhlxtynaxdd2nn27sn7pozm-dev',
        Images: 'Images-jpenhlxtynaxdd2nn27sn7pozm-dev',
        Url: 'Url-jpenhlxtynaxdd2nn27sn7pozm-dev',
      },
    },
  ],
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 360,
      description: 'graphqlportfolio',
    },
  },
  schema,
});

export function applyEscapeHatches(backend: Backend) {
  const cfnGraphqlApi = backend.data.resources.cfnResources.cfnGraphqlApi;
  cfnGraphqlApi.additionalAuthenticationProviders = [
    {
      authenticationType: 'API_KEY',
    },
  ];
}
