export class CountingSemaphore {
  private counter: Int32Array;

  constructor(sharedBuffer: SharedArrayBuffer, threads?: number);

  acquire(): void;

  release(): void;
}
