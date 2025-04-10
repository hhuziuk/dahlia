const { Worker, isMainThread } = require("node:worker_threads");
const { strictEqual } = require("node:assert");
const { describe, it } = require("mocha");

describe("mutex test with worker_threads", function () {
  this.timeout(20000);

  it("mutex sync lock test", async function () {
    if (!isMainThread) return;

    const mutexBuffer = new SharedArrayBuffer(4);
    const counterBuffer = new SharedArrayBuffer(4);
    const counter = new Int32Array(counterBuffer);
    Atomics.store(counter, 0, 0);

    const workers = Array.from({ length: 10 }, () => {
      return new Promise((resolve) => {
        const worker = new Worker("./test/primitives/mutex/worker.js", {
          workerData: { mutexBuffer, counterBuffer },
        });
        worker.on("exit", resolve);
      });
    });

    await Promise.all(workers);
    strictEqual(counter[0], 10 * 1_000_000, "Counter mismatch in sync test");
  });

  it("mutex async lock test", async function () {
    if (!isMainThread) return;

    const mutexBuffer = new SharedArrayBuffer(4);
    const counterBuffer = new SharedArrayBuffer(4);
    const counter = new Int32Array(counterBuffer);
    Atomics.store(counter, 0, 0);

    const workers = Array.from({ length: 10 }, () => {
      return new Promise((resolve) => {
        const worker = new Worker("./test/primitives/mutex/worker-async.js", {
          workerData: { mutexBuffer, counterBuffer },
        });
        worker.on("exit", resolve);
      });
    });

    await Promise.all(workers);
    strictEqual(counter[0], 10 * 1_000_000, "Counter mismatch in async test");
  });
});
