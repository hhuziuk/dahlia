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
  #length: number;
  #head: ListNode<T> | null;
  #tail: ListNode<T> | null;

  constructor();

  enqueue(item: T): void;

  dequeue(): T | null;

  peek(): T | null;

  readonly size: number;

  isEmpty(): boolean;
}
