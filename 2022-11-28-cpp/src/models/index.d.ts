import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type AlgoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerAlgo = {
  readonly id: string;
  readonly name: string;
  readonly filePath?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAlgo = {
  readonly id: string;
  readonly name: string;
  readonly filePath?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Algo = LazyLoading extends LazyLoadingDisabled ? EagerAlgo : LazyAlgo

export declare const Algo: (new (init: ModelInit<Algo, AlgoMetaData>) => Algo) & {
  copyOf(source: Algo, mutator: (draft: MutableModel<Algo, AlgoMetaData>) => MutableModel<Algo, AlgoMetaData> | void): Algo;
}