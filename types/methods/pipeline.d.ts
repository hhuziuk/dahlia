import { Worker } from "node:worker_threads";

export type SerializableData =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | any[]
  | Map<any, any>
  | Set<any>
  | Date
  | RegExp
  | Error
  | ArrayBuffer
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

export async function createParallelPipeline<T extends SerializableData>(workers: Worker[], transferData: T): Promise<Worker[]>;