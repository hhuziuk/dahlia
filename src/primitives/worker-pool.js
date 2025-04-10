const { Worker } = require("node:worker_threads");

class WorkerPool {
  constructor(workerNumber = 1, workerPath, workerData = {}) {
    this.workerNumber = workerNumber;
    this.workerPath = workerPath;
    this.workerPool = new Set();
    this.callbackIdCounter = 0;
    this.pendingTasks = 0;
    this.callbackQueue = [];
    this.stopped = false;
    this.workerData = workerData;
    this.#initializeWorkers();
  }

  #initializeWorkers() {
    for (let i = 0; i < this.workerNumber; i++) {
      this.#createWorker();
    }
  }

  #createWorker() {
    const worker = new Worker(this.workerPath, { workerData: this.workerData });
    worker.currentCallback = undefined;
    worker.currentResolve = undefined;
    worker.currentReject = undefined;

    this.workerPool.add(worker);

    const clearTask = () => {
      // Декрементуємо завдання, якщо було прив'язане завдання
      if (worker.currentCallback !== undefined) {
        this.pendingTasks--;
      }
      delete worker.currentCallback;
      delete worker.currentResolve;
      delete worker.currentReject;
      this.#dispatchNextTask();
    };

    worker.on("message", (data) => {
      const { callbackId, result, error } = data;

      if (worker.currentCallback === callbackId) {
        error ? worker.currentReject(error) : worker.currentResolve(result);
        clearTask();
      } else {
        this.#dispatchNextTask();
      }
    });

    worker.on("error", (errorEvent) => {
      if (worker.currentCallback !== undefined) {
        worker.currentReject(
          new Error(`Worker error: ${errorEvent.message || errorEvent}`),
        );
        clearTask();
      }
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        if (worker.currentCallback !== undefined) {
          worker.currentReject(
            new Error(`Worker stopped with exit code ${code}`),
          );
        }
      }
      this.workerPool.delete(worker);
      this.#dispatchNextTask();
    });

    this.#dispatchNextTask();
  }

  #dispatchNextTask() {
    if (this.stopped || this.callbackQueue.length === 0) {
      return;
    }

    const worker = [...this.workerPool].find(
      (w) => w.currentCallback === undefined,
    );
    if (!worker) {
      return;
    }

    const callback = this.callbackQueue.shift();
    worker.currentCallback = callback.callbackId;
    worker.currentResolve = callback.resolve;
    worker.currentReject = callback.reject;

    worker.postMessage({ id: callback.callbackId, data: callback.data });
    this.pendingTasks++;
  }

  submit(data) {
    return new Promise((resolve, reject) => {
      const callbackId = this.callbackIdCounter++;
      this.callbackQueue.push({ callbackId, data, resolve, reject });
      this.#dispatchNextTask();
    });
  }

  stop() {
    this.stopped = true;
  }

  resume() {
    if (!this.stopped) return;
    this.stopped = false;
    for (const worker of this.workerPool) {
      this.#dispatchNextTask();
    }
  }

  wait() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.pendingTasks === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);
    });
  }

  async terminate() {
    this.stopped = true;
    for (const worker of this.workerPool) {
      await worker.terminate();
    }
    this.workerPool.clear();

    return this.workerPool.size;
  }
}

module.exports = { WorkerPool };
