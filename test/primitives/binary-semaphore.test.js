const test = require("node:test");
const assert = require("node:assert");
const { Worker, isMainThread, workerData } = require("node:worker_threads");
const { BinarySemaphore } = require("../../src/primitives/binary-semaphore.js");

test(
  "binary semaphore test with worker_threads",
  async (outerT) => {
    const NUMBER_OF_THREADS = 10;
    const ITERATIONS = 1_000_000;

    await outerT.test(
      "binary semaphore sync lock test",
      { concurrency: false },
      async (t) => {
        if (isMainThread) {
          const semaphoreBuffer = new SharedArrayBuffer(4);
          const counterBuffer = new SharedArrayBuffer(4);
          const semaphore = new BinarySemaphore(semaphoreBuffer);

          const counter = new Int32Array(counterBuffer);
          Atomics.store(counter, 0, 0);

          const workers = [];

          for (let i = 0; i < NUMBER_OF_THREADS; i++) {
            workers.push(
              new Promise((resolve) => {
                const worker = new Worker(__filename, {
                  workerData: { semaphoreBuffer, counterBuffer },
                });
                worker.on("exit", resolve);
              }),
            );
          }

          await Promise.all(workers);

          assert.strictEqual(
            counter[0],
            NUMBER_OF_THREADS * ITERATIONS,
            `Expected ${NUMBER_OF_THREADS * 1_000_000}, but got ${counter[0]}`,
          );
        } else {
          const { semaphoreBuffer, counterBuffer } = workerData;
          const counter = new Int32Array(counterBuffer);
          const semaphore = new BinarySemaphore(semaphoreBuffer);

          for (let i = 0; i < ITERATIONS; i++) {
            semaphore.acquire();
            counter[0]++;
            semaphore.release();
          }
          process.exit(0);
        }
      },
    );
  },
);
