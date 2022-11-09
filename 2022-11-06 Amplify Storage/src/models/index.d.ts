import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type SongMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerSong = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly filePath: string;
  readonly likes: number;
  readonly owner: string;
  readonly createdBy: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySong = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly filePath: string;
  readonly likes: number;
  readonly owner: string;
  readonly createdBy: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Song = LazyLoading extends LazyLoadingDisabled ? EagerSong : LazySong

export declare const Song: (new (init: ModelInit<Song, SongMetaData>) => Song) & {
  copyOf(source: Song, mutator: (draft: MutableModel<Song, SongMetaData>) => MutableModel<Song, SongMetaData> | void): Song;
}