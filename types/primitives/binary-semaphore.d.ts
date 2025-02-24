export class BinarySemaphore {
  private data: Int32Array;

  constructor(sharedBuffer: SharedArrayBuffer);

  acquire(): void;
  release(): void;
}
