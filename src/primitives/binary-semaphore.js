const { isMainThread } = require("node:worker_threads");

class BinarySemaphore {
  constructor(sharedBuffer) {
    this.data = new Int32Array(sharedBuffer);
    if (isMainThread) {
      Atomics.store(this.data, 0, 1);
    }
    // 0 - is busy
    // 1 - is free
  }

  wait() {
    while (true) {
      if (Atomics.compareExchange(this.data, 0, 1, 0) === 1) return;
      Atomics.wait(this.data, 0, 0);
    }
  }

  signal() {
    Atomics.store(this.data, 0, 1);
    Atomics.notify(this.data, 0, 1);
  }
}

module.exports = { BinarySemaphore };
