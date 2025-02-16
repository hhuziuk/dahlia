const { threadId, isMainThread } = require('node:worker_threads');

class Mutex {
    constructor(sharedBuffer) {
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

    unlock() {
        if (this.ownerThreadId !== threadId) {
            throw new Error("unlock: Only the thread that locked the mutex can unlock it.");
        }
        Atomics.store(this.data, 0, 0);
        Atomics.notify(this.data, 0);
        this.ownerThreadId = null;
    }
}

module.exports = { Mutex };
