/// <reference lib="es2017" />

import { RwLock } from "../primitives/rw-lock";

export declare class ConcurrentSet<T> {
    private map: Map<T, true>;

    readerBuffer: SharedArrayBuffer;
    writerBuffer: SharedArrayBuffer;
    rwLock: RwLock;

    constructor();

    add(value: T): this;

    clear(): void;

    delete(value: T): boolean;

    has(value: T): boolean;

    get size(): number;

    values(): IterableIterator<T>;

    [Symbol.iterator](): IterableIterator<T>;
}