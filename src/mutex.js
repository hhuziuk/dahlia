class Mutex {
    constructor() {
        this.buffer = new SharedArrayBuffer(4);
        this.data = new Int32Array(this.buffer);
        Atomics.store(this.data, 0, 0);
        // 1 - is locked
        // 0 - is unlocked
    }

    // timeout in Ms
    syncLock(timeout = 1000) {
        const startTime = Date.now();
        while(true) {
            const isLocked = Atomics.compareExchange(this.data, 0, 0, 1) === 0;
            if (isLocked) { return; }

            const remainingTime = timeout - (Date.now() - startTime);

            const result = Atomics.wait(this.data, 0, 1, remainingTime);

            if (result === "timed-out") {
                throw new Error("syncLock: Timeout waiting for lock");
            }
        }
    }

    syncUnlock() {
        Atomics.store(this.data, 0, 0);
        Atomics.notify(this.data, 0, 1)
    }

    async asyncLock(timeout = 1000) {

    }

    async asyncUnlock(){

    }
}

