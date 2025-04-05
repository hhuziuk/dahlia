const { describe, it } = require("mocha");
const assert = require("node:assert");
const { Worker, isMainThread, workerData } = require("node:worker_threads");
const { RwLock } = require("../../../src/primitives/rw-lock.js");

const NUMBER_OF_THREADS = 10;
const MAX_CONCURRENT_THREADS = 3;
const ITERATIONS = 1_000_000;

if (!isMainThread) {
    const { readMutexBuffer, writeMutexBuffer, counterBuffer, maxThreads } = workerData;
    const counter = new Int32Array(counterBuffer);
    const lock = new RwLock(readMutexBuffer, writeMutexBuffer);

    for (let i = 0; i < ITERATIONS; i++) {
        lock.readLock();
        Atomics.add(counter, 0, 1);
        lock.readUnlock();
    }
    process.exit(0);
}

describe("Read-Write Lock with worker_threads", function () {
    this.timeout(10000);

    it("should sync lock using read-write lock", async function () {
        const readMutexBuffer = new SharedArrayBuffer(4);
        const writeMutexBuffer = new SharedArrayBuffer(4);
        const counterBuffer = new SharedArrayBuffer(4);
        const lock = new RwLock(readMutexBuffer, writeMutexBuffer);

        const counter = new Int32Array(counterBuffer);
        Atomics.store(counter, 0, 0);

        const workers = [];

        for (let i = 0; i < NUMBER_OF_THREADS; i++) {
            workers.push(
                new Promise((resolve) => {
                    const worker = new Worker(__filename, {
                        workerData: {
                            readMutexBuffer,
                            writeMutexBuffer,
                            counterBuffer,
                            maxThreads: MAX_CONCURRENT_THREADS,
                        },
                    });
                    worker.on("exit", resolve);
                })
            );
        }

        await Promise.all(workers);

        assert.strictEqual(
            counter[0],
            NUMBER_OF_THREADS * ITERATIONS,
            `Expected ${NUMBER_OF_THREADS * ITERATIONS}, but got ${counter[0]}`
        );
    });
});
