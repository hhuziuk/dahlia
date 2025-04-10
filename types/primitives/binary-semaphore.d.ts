export class BinarySemaphore {
  private data: Int32Array;

  constructor(sharedBuffer: SharedArrayBuffer);

  acquire(): Promise<void>;

  release(): void;
}
