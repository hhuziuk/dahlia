const path = require('node:path');
const { WorkerPool } = require('../primitives/worker-pool.js');

class Scheduler {
    constructor(numWorkers, modulePath) {
        const workerScriptPath = path.resolve(__dirname, 'worker.js');
        const handlersModulePath = path.resolve(__dirname, modulePath);

        this.workerPool = new WorkerPool(
            numWorkers,
            workerScriptPath,
            { modulePath: handlersModulePath }
        );

        this.taskId = 1;
    }

    start() {
        this.workerPool.resume();
    }

    async runTask(name, payload) {
        const id = this.taskId++;
        try {
            return await this.workerPool.submit({id, type: name, payload});
        } catch (err) {
            throw new Error(`Task ${name} failed: ${err.message}`);
        }
    }

    async stop() {
        await this.workerPool.terminate();
        process.exit(0);
    }
}

module.exports = { Scheduler };