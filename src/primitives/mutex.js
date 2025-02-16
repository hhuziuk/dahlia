const { threadId, isMainThread } = require("node:worker_threads");

class Mutex {
  constructor(sharedBuffer) {
    if (!(sharedBuffer instanceof SharedArrayBuffer)) {
      throw new Error("Invalid shared buffer: Must be a SharedArrayBuffer");
    }
    this.data = new Int32Array(sharedBuffer);
    if (isMainThread) {
      Atomics.store(this.data, 0, 0);
    }
    this.ownerThreadId = null;
    // 1 - is locked
    // 0 - is unlocked
  }

  lock() {
    while (Atomics.compareExchange(this.data, 0, 0, 1) !== 0) {
      Atomics.wait(this.data, 0, 1);
    }
    this.ownerThreadId = threadId;
  }

  async asyncLock() {
    while (Atomics.compareExchange(this.data, 0, 0, 1) !== 0) {
      if (typeof Atomics.waitAsync === "function") {
        await Atomics.waitAsync(this.data, 0, 1).value;
      } else {
        Atomics.wait(this.data, 0, 1);
      }
    }
    this.ownerThreadId = threadId;
  }

  unlock() {
    if (this.ownerThreadId !== threadId) {
      throw new Error(
        "unlock: Only the thread that locked the mutex can unlock it.",
      );
    }
    if (Atomics.load(this.data, 0) === 0) {
      throw new Error("unlock: Mutex is already unlocked.");
    }
    Atomics.store(this.data, 0, 0);
    Atomics.notify(this.data, 0);
    this.ownerThreadId = null;
  }
}

module.exports = { Mutex };
