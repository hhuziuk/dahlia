const { describe, it } = require("mocha");
const { strictEqual } = require("node:assert");
const {
  BinarySemaphore,
} = require("../../../src/primitives/binary-semaphore.js");

describe("Binary Semaphore Concurrency and Synchronization Test", async (outerT) => {
  const ITERATIONS = 100_000;
  let semaphore;
  let counter;

  beforeEach(() => {
    semaphore = new BinarySemaphore(new SharedArrayBuffer(4));
    counter = 0;
  });

  it("Ensures Binary Semaphore Properly Synchronizes Concurrent Increments", async function () {
    this.timeout(10000);

    const tasks = Array.from({ length: 10 }, async () => {
      for (let i = 0; i < ITERATIONS; i++) {
        await semaphore.acquire();
        counter++;
        semaphore.release();
      }
    });

    await Promise.all(tasks);

    strictEqual(
      counter,
      10 * ITERATIONS,
      `Expected ${10 * ITERATIONS}, but got ${counter}`,
    );
  });
});
