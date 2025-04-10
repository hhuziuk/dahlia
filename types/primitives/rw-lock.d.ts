import { Mutex } from "./mutex";

export class RwLock {
  private reader: number;
  private writer: boolean;
  private readMutex: Mutex;
  private writeMutex: Mutex;
  private politics: boolean;

  private waitingWriters?: number;
  private readerGate?: Mutex;

  constructor(
      readMutexBuffer: SharedArrayBuffer,
      writeMutexBuffer: SharedArrayBuffer,
      politics?: boolean // true = fair, false = greedy
  );

  readLock(): void;

  writeLock(): void;

  readUnlock(): void;

  writeUnlock(): void;

  private readLockGreedy(): void;
  private readLockFair(): void;
  private writeLockGreedy(): void;
  private writeLockFair(): void;
}
