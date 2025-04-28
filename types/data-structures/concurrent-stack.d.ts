/// <reference lib="es2017" />

import { RwLock } from "../primitives/rw-lock";

declare class ListNode<T> {
    element: T;
    next: ListNode<T> | null;
    prev: ListNode<T> | null;
    constructor(element: T);
}

export declare class ConcurrentStack<T> {
    private readerBuffer: SharedArrayBuffer;
    private writerBuffer: SharedArrayBuffer;
    private rwLock: RwLock;
    private _length: number;
    private _head: ListNode<T> | null;

    constructor();

    push(item: T): void;

    pop(): T | null;

    peek(): T | null;

    readonly size: number;

    isEmpty(): boolean;
}