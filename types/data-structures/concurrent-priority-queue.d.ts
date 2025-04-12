/// <reference lib="es2017" />

import { RwLock } from "../primitives/rw-lock";

export type Strategy = "max" | "min";

declare class ListNode<T> {
    element: T;
    next: ListNode<T> | null;
    constructor(element: T);
}

export class ConcurrentPriorityQueue<T> {
    readonly readerBuffer: SharedArrayBuffer;
    readonly writerBuffer: SharedArrayBuffer;

    readonly rwLock: RwLock;

    readonly strategy: Strategy;

    constructor(strategy?: Strategy);

    enqueue(item: T, priority: number): void;

    dequeue(): T | null;

    peek(): T | null;

    isEmpty(): boolean;

    get size(): number;
}
