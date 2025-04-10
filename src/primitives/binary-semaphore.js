class BinarySemaphore {
  constructor(sharedBuffer) {
    this.data = new Int32Array(sharedBuffer);
    Atomics.store(this.data, 0, 1);
    // 1 - is free
    // 0 - is busy
  }

  async acquire() {
    while (Atomics.compareExchange(this.data, 0, 1, 0) !== 1) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  release() {
    Atomics.store(this.data, 0, 1);
    Atomics.notify(this.data, 0, 1);
  }
}

module.exports = { BinarySemaphore };
