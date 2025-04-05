const { Worker } = require("node:worker_threads");
const { expect } = require("chai");
const path = require("path");
const {WorkerPool} = require("../../src/primitives/worker-pool");

describe("WorkerPool", function () {
    const workerPath = path.resolve(__dirname, "mockWorker.js");
    let pool;

    beforeEach(() => {
        pool = new WorkerPool(2, workerPath);
    });

    afterEach(async () => {
        await pool.terminate();
    });

    it("should process tasks correctly", async function () {
        const result = await pool.submit(5);
        expect(result).to.equal(25);
    });

    it("should handle multiple tasks", async function () {
        const results = await Promise.all([pool.submit(2), pool.submit(3), pool.submit(4)]);
        expect(results).to.deep.equal([4, 9, 16]);
    });

    it("should stop and resume processing", async function () {
        pool.stop();
        const promise = pool.submit(6);
        setTimeout(() => pool.resume(), 100);
        const result = await promise;
        expect(result).to.equal(36);
    });

    it("should wait for all tasks to complete", async function () {
        pool.submit(7);
        pool.submit(8);
        await pool.wait();
        expect(pool.pendingTasks).to.equal(0);
    });

    it("should terminate all workers", async function () {
        await pool.terminate();
        expect(pool.workerPool.size).to.equal(0);
    });
});
