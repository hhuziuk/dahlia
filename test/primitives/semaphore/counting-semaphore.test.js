const { describe, it } = require("mocha");
const assert = require("node:assert");
const { Worker, isMainThread, workerData } = require("node:worker_threads");
const {
  CountingSemaphore,
} = require("../../../src/primitives/counting-semaphore.js");

const NUMBER_OF_THREADS = 10;
const MAX_CONCURRENT_THREADS = 3;
const ITERATIONS = 1_000_000;

if (!isMainThread) {
  const { semaphoreBuffer, counterBuffer, maxThreads } = workerData;
  const counter = new Int32Array(counterBuffer);
  const semaphore = new CountingSemaphore(semaphoreBuffer, maxThreads);

  for (let i = 0; i < ITERATIONS; i++) {
    semaphore.acquire();
    Atomics.add(counter, 0, 1);
    semaphore.release();
  }
  process.exit(0);
}

describe("Counting Semaphore with worker_threads", function () {
  this.timeout(10000);

  it("should sync lock using counting semaphore", async function () {
    const semaphoreBuffer = new SharedArrayBuffer(4);
    const counterBuffer = new SharedArrayBuffer(4);
    const semaphore = new CountingSemaphore(
      semaphoreBuffer,
      MAX_CONCURRENT_THREADS,
    );

    const counter = new Int32Array(counterBuffer);
    Atomics.store(counter, 0, 0);

    const workers = [];

    for (let i = 0; i < NUMBER_OF_THREADS; i++) {
      workers.push(
        new Promise((resolve) => {
          const worker = new Worker(__filename, {
            workerData: {
              semaphoreBuffer,
              counterBuffer,
              maxThreads: MAX_CONCURRENT_THREADS,
            },
          });
          worker.on("exit", resolve);
        }),
      );
    }

    await Promise.all(workers);

    assert.strictEqual(
      counter[0],
      NUMBER_OF_THREADS * ITERATIONS,
      `Expected ${NUMBER_OF_THREADS * ITERATIONS}, but got ${counter[0]}`,
    );
  });
});
