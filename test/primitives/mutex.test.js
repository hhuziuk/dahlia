const test = require("node:test");
const assert = require("node:assert");
const { Worker, isMainThread, workerData } = require("node:worker_threads");
const { Mutex } = require("../../src/primitives/mutex.js");

test("mutex test with worker_threads", async (t) => {
  const NUMBER_OF_THREADS = 10;
  const ITERATIONS = 1_000_000;

  await t.test("mutex sync lock test", async (t) => {
    if (isMainThread) {
      const mutexBuffer = new SharedArrayBuffer(4);
      const counterBuffer = new SharedArrayBuffer(4);

      const counter = new Int32Array(counterBuffer);
      Atomics.store(counter, 0, 0);

      const workers = [];

      for (let i = 0; i < NUMBER_OF_THREADS; i++) {
        workers.push(
          new Promise((resolve) => {
            const worker = new Worker(__filename, {
              workerData: { mutexBuffer, counterBuffer },
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
      const { mutexBuffer, counterBuffer } = workerData;
      const mutex = new Mutex(mutexBuffer);
      const counter = new Int32Array(counterBuffer);

      for (let i = 0; i < ITERATIONS; i++) {
        mutex.lock();
        counter[0]++;
        mutex.unlock();
      }
      process.exit(0);
    }
  });
});
