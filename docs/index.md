# Dahlia Concurrency — Documentation

Lightweight concurrency and parallelism toolkit for Node.js built on `worker_threads`.

- Repository: https://github.com/hhuziuk/dahlia
- npm: https://www.npmjs.com/package/dahlia-concurrency

## What’s inside
- Primitives: `Mutex`, `RwLock`, `CountingSemaphore`, `BinarySemaphore`, `WorkerPool`
- Data structures: `ConcurrentQueue`, `ConcurrentPriorityQueue`, `ConcurrentDeque`, `ConcurrentStack`, `ConcurrentSet`
- Methods: `parallelPipeline(...)`, `parallelQuickSort(...)` and quick-sort utilities
- Task scheduler: `Scheduler`

## Install
```bash
npm install dahlia-concurrency
```

## Quick start
```js
const {
  Mutex,
  WorkerPool,
  Scheduler,
  ConcurrentQueue,
  parallelPipeline,
} = require('dahlia-concurrency');

const mutex = new Mutex();
const q = new ConcurrentQueue();
q.enqueue(1); q.enqueue(2);

const pool = new WorkerPool(2, require('node:path').resolve(__dirname, 'worker.js'));

const scheduler = new Scheduler(2, require('node:path').resolve(__dirname, 'handlers.js'));
scheduler.start();
```

## Navigation
- [Primitives](./primitives.md)
- [Data structures](./data-structures.md)
- [Methods](./methods.md)
- [Task Scheduler](./task-scheduler.md)
- [Contracts](./contracts.md)
- [Testing and contributing](./testing-and-contributing.md)
- [Benchmarks](./benchmarks.md)
