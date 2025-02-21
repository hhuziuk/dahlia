class BinarySemaphore {
  constructor(sharedBuffer) {
    this.data = new Int32Array(sharedBuffer);
    Atomics.store(this.data, 0, 1);
    // 1 - is free
    // 0 - is busy
  }

  acquire() {
    while (Atomics.compareExchange(this.data, 0, 1, 0) !== 1) {
      Atomics.wait(this.data, 0,0)
    }
  }

  async asyncAcquire() {
    while (Atomics.compareExchange(this.data, 0, 1, 0) !== 1) {
      await Atomics.waitAsync(this.data, 0,0).value
    }
  }

  release() {
    Atomics.store(this.data, 0, 1);
    Atomics.notify(this.data, 0, 1);
  }
}

module.exports = { BinarySemaphore };
