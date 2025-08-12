/// <reference lib="es2017" />

import { RwLock } from "../primitives/rw-lock";

declare class ListNode<T> {
  element: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;
  constructor(element: T);
}

export declare class ConcurrentDeque<T> {
  private readerBuffer: SharedArrayBuffer;
  private writerBuffer: SharedArrayBuffer;
  private rwLock: RwLock;
  private _length: number;
  private _head: ListNode<T> | null;
  private _tail: ListNode<T> | null;

  constructor();

  enqueueFront(item: T): void;

  enqueueBack(item: T): void;

  dequeueFront(): T | null;

  dequeueBack(): T | null;

  peekFront(): T | null;

  peekBack(): T | null;

  readonly size: number;

  isEmpty(): boolean;
}
