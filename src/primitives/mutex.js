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

  lock(timeout = 5000) {
    const start = Date.now();
    while (Atomics.compareExchange(this.data, 0, 0, 1) !== 0) {
      const waited = Atomics.wait(this.data, 0, 1, timeout);
      if (Date.now() - start >= timeout || waited === "timed-out") {
        throw new Error("Mutex lock timeout");
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
    Atomics.notify(this.data, 0, 1); // count is equal 1 because we free only one thread
    this.ownerThreadId = null;
  }

  acquire() {
    return new Promise((resolve) => {
      while (Atomics.compareExchange(this.data, 0, 0, 1) !== 0) {
        Atomics.wait(this.data, 0, 1);
      }
      this.ownerThreadId = threadId;
      resolve();
    });
  }
}

module.exports = { Mutex };
