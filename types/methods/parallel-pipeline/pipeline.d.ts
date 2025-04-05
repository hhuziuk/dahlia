import { Worker, MessagePort } from "node:worker_threads";

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
    | SharedArrayBuffer
    | Int8Array | Uint8Array | Uint8ClampedArray
    | Int16Array | Uint16Array
    | Int32Array | Uint32Array
    | Float32Array | Float64Array
    | BigInt64Array | BigUint64Array
    | MessagePort;

export function createParallelPipeline<T extends SerializableData>(
    workers: Worker[],
    transferData: T
): Worker[];

export interface PipelineWorkerSetupMessage {
    port: MessagePort;
    func: 'send' | 'receive';
}

export type PipelineWorkerMessage<T extends SerializableData> =
    | PipelineWorkerSetupMessage
    | PipelineWorkerDataMessage<T>;