class CountingSemaphore {
  constructor(sharedBuffer, threads = 1) {
    this.counter = new Int32Array(sharedBuffer);
    if (threads <= 0) {
      throw new Error("Threads must be a positive integer");
    }
    if (typeof threads === "number") {
      Atomics.store(this.counter, 0, threads);
    }
  }

  acquire() {
    while (true) {
      let current = Atomics.load(this.counter, 0);
      if (current > 0) {
        const previous = current - 1;
        if (
          Atomics.compareExchange(this.counter, 0, current, previous) ===
          current
        ) {
          return;
        }
      } else {
        Atomics.wait(this.counter, 0, 0);
      }
    }
  }

  release() {
    Atomics.add(this.counter, 0, 1);
    Atomics.notify(this.counter, 0, 1);
  }

  async asyncAcquire() {
    while (true) {
      let current = Atomics.load(this.counter, 0);
      if (current > 0) {
        const previous = current - 1;
        if (
          Atomics.compareExchange(this.counter, 0, current, previous) ===
          current
        ) {
          return;
        }
      } else {
        await Atomics.waitAsync(this.counter, 0, 0).value;
      }
    }
  }
}

module.exports = CountingSemaphore;
