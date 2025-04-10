export class Mutex {
  private data: Int32Array;
  private ownerThreadId: number | null;

  constructor(sharedBuffer: SharedArrayBuffer);

  lock(timeout?: number): void;

  unlock(): void;

  acquire(): Promise<void>;
}
