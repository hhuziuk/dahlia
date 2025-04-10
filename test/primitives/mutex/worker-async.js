const { workerData, threadId } = require("worker_threads");
const { Mutex } = require("../../../src/primitives/mutex.js");

const { mutexBuffer, counterBuffer } = workerData;
const mutex = new Mutex(mutexBuffer);
const counter = new Int32Array(counterBuffer);

(async () => {
  for (let i = 0; i < 1_000_000; i++) {
    await mutex.acquire();
    counter[0]++;
    mutex.unlock();
  }
  process.exit(0);
})();
