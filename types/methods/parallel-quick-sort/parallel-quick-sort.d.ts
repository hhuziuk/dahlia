import { Worker } from "node:worker_threads";

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type TypedArrayConstructor<T extends TypedArray = TypedArray> = {
  new (length?: number): T;
  new (array: ArrayLike<number | bigint> | ArrayBufferLike): T;
  new (buffer: ArrayBufferLike, byteOffset?: number, length?: number): T;
  BYTES_PER_ELEMENT: number;
  readonly prototype: T;
  readonly name: string;
};

export interface SortSegment {
  start: number;
  end: number;
}

export interface QuickSortWorkerData {
  sharedBuffer: SharedArrayBuffer;
  length: number;
  start: number;
  end: number;
  typeName: string;
  ascending: boolean;
}

export function parallelQuickSort<T extends TypedArray>(
  data: ArrayLike<number | bigint> | T,
  typedArrayType: TypedArrayConstructor<T>,
  workers?: number,
  isAscending?: boolean,
): Promise<T>;
