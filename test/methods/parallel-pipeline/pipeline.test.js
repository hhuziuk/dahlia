const { describe, it } = require("mocha");
const { strictEqual } = require("node:assert");
const { Worker } = require("node:worker_threads");
const { resolve } = require("node:path");
const { createParallelPipeline } = require("../../src/methods/parallel-pipeline/pipeline.js");

const workerPath = resolve(__dirname, "pipeline-worker.js");

describe("async parallel pipeline", function () {
  it("should process data in a simple parallel pipeline", function (done) {
    this.timeout(5000);

    const worker1 = new Worker(workerPath);
    const worker2 = new Worker(workerPath);
    const worker3 = new Worker(workerPath);
    const workers = [worker1, worker2, worker3];
    const data = new Int32Array([1, 2, 3, 4, 5]);

    createParallelPipeline(workers, data);

    worker3.on("message", async (message) => {
      if (message.result) {
        try {
          const finalResult = message.result;

          strictEqual(
              JSON.stringify(Array.from(finalResult)),
              JSON.stringify([4, 5, 6, 7, 8]),
              `Expected [4, 5, 6, 7, 8], but got ${JSON.stringify(finalResult)}`,
          );

          await Promise.all(workers.map((worker) => worker.terminate()));
          done();
        } catch (err) {
          done(err);
        }
      }
    });

    worker3.on("error", (err) => done(err));
  });
});