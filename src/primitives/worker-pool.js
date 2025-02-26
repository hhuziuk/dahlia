class ThreadPool {
  constructor(workerNumber = 1, workerPath) {
    this.workerNumber = workerNumber;
    this.workerPath = workerPath;
    this.workerPool = new Set();
    this.callbackIdCounter = 0;
    this.callbackQueue = [];
    this.stopped = false;
    this.#initializeWorkers();
  }

  #initializeWorkers() {
    for (let i = 0; i < this.workerNumber; i++) {
      this.#createWorker();
    }
  }

  #createWorker() {
    const worker = new Worker(this.workerPath);
    this.workerPool.add(worker);

    const clearTask = () => {
      delete worker.currentCallback;
      delete worker.currentResolve;
      delete worker.currentReject;
    };

    worker.onmessage = ({ data }) => {
      const { callbackId, result, error } = data;

      if (worker.currentCallback === callbackId) {
        error ? worker.currentReject(error) : worker.currentResolve(result);
        clearTask();
      }
      this.#addTask(worker);
    };

    worker.onerror = (errorEvent) => {
      if (worker.currentCallback !== undefined) {
        worker.currentReject(errorEvent.message);
        clearTask();
      }
      this.#addTask(worker);
    };

    this.#addTask(worker);
  }

  #addTask(worker) {
    if (worker.currentCallback !== undefined) return; // worker is busy
    if (this.callbackQueue.length === 0) return;
    if (this.stopped) return;

    const callback = this.callbackQueue.shift();
    worker.currentCallback = callback.callbackId;
    worker.currentResolve = callback.resolve;
    worker.currentReject = callback.reject;
    worker.postMessage({ id: callback.callbackId, data: callback.data });
  }

  submit(data) {
    return new Promise((resolve, reject) => {
      const callbackId = this.callbackIdCounter++;
      this.callbackQueue.push({ callbackId, data, resolve, reject });

      for (const worker of this.workerPool) {
        this.#addTask(worker);
      }
    });
  }

  stop() {
    this.stopped = true;
  }

  resume() {
    if (!this.stopped) return;
    this.stopped = false;
    for (const worker of this.workerPool) {
      this.#addTask(worker);
    }
  }

  wait() {
    return new Promise((resolve) => {
      const checkArray = setInterval(() => {
        const allWorkersAreFree = [...this.workerPool].every(
          (worker) => worker.currentCallback === undefined,
        );
        const isEmpty = this.callbackQueue.length === 0;
        if (isEmpty && allWorkersAreFree) {
          clearInterval(checkArray);
          resolve();
        }
      }, 10);
    });
  }

  terminate() {
    for (const worker of this.workerPool) {
      worker.terminate();
    }
    this.workerPool.clear();
  }
}
