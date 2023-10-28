import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerAlbums = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Albums, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly desc?: string | null;
  readonly date?: string | null;
  readonly featuredImg?: string | null;
  readonly Images?: (Images | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAlbums = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Albums, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly desc?: string | null;
  readonly date?: string | null;
  readonly featuredImg?: string | null;
  readonly Images: AsyncCollection<Images>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Albums = LazyLoading extends LazyLoadingDisabled ? EagerAlbums : LazyAlbums

export declare const Albums: (new (init: ModelInit<Albums>) => Albums) & {
  copyOf(source: Albums, mutator: (draft: MutableModel<Albums>) => MutableModel<Albums> | void): Albums;
}

type EagerImages = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Images, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly desc?: string | null;
  readonly filename?: string | null;
  readonly date?: string | null;
  readonly albumsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyImages = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Images, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly desc?: string | null;
  readonly filename?: string | null;
  readonly date?: string | null;
  readonly albumsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Images = LazyLoading extends LazyLoadingDisabled ? EagerImages : LazyImages

export declare const Images: (new (init: ModelInit<Images>) => Images) & {
  copyOf(source: Images, mutator: (draft: MutableModel<Images>) => MutableModel<Images> | void): Images;
}

type EagerTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo) & {
  copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}