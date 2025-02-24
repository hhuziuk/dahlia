const test = require("node:test");
const assert = require("node:assert");
const { Worker } = require("node:worker_threads");
const createParallelPipeline = require('../../src/methods/pipeline.js');
const {resolve} = require("node:path");

const workerPath = resolve(__dirname, 'worker.js');

test("async parallel pipeline", async (t) => {

    await t.test("simple parallel pipeline", async (t) => {
        const worker1 = new Worker(workerPath);
        const worker2 = new Worker(workerPath);
        const worker3 = new Worker(workerPath);

        const workers = [worker1, worker2, worker3];
        const data = new Int32Array([1, 2, 3, 4, 5]);

        await createParallelPipeline(workers, data);

        worker3.on('message', async (message) => {
            if (message.result) {
                const finalResult = message.result;
                assert.deepStrictEqual(
                    Array.from(finalResult),
                    [4, 5, 6, 7, 8],
                    `Expected [4, 5, 6, 7, 8], but got ${JSON.stringify(finalResult)}`
                );

                await Promise.all(workers.map(worker => worker.terminate()));
            }
        });
    });
});
