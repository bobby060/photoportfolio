// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Albums, Images, Todo } = initSchema(schema);

export {
  Albums,
  Images,
  Todo
};