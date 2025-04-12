/// <reference lib="es2017" />

import { RwLock } from "../primitives/rw-lock";

declare class ListNode<T> {
  element: T;
  next: ListNode<T> | null;
  constructor(element: T);
}

export declare class ConcurrentQueue<T> {
  private readerBuffer: SharedArrayBuffer;
  private writerBuffer: SharedArrayBuffer;
  private rwLock: RwLock;
  private _length: number;
  private _head: ListNode<T> | null;
  private _tail: ListNode<T> | null;

  constructor();

  enqueue(item: T): void;

  dequeue(): T | null;

  peek(): T | null;

  readonly size: number;

  isEmpty(): boolean;
}
