# Concurrency primitives

Source: `src/primitives/`
Exports: `index.js`
Types: `types/primitives/*.d.ts`

## Mutex
Mutual exclusion for sequential access.

```js
const { Mutex } = require('dahlia-concurrency');
const m = new Mutex();

await m.lock();
try {
  // critical section
} finally {
  m.unlock();
}
```

## RwLock
Reader/writer lock: many readers, one writer.

```js
const { RwLock } = require('dahlia-concurrency');
const lock = new RwLock();

await lock.readLock();
try { /* read */ } finally { lock.readUnlock(); }

await lock.writeLock();
try { /* write */ } finally { lock.writeUnlock(); }
```

## CountingSemaphore
Counting semaphore to limit concurrency.

```js
const { CountingSemaphore } = require('dahlia-concurrency');
const sem = new CountingSemaphore(3);

await sem.acquire();
try { /* work */ } finally { sem.release(); }
```

## BinarySemaphore
Binary semaphore (similar to a mutex with different API).

```js
const { BinarySemaphore } = require('dahlia-concurrency');
const sem = new BinarySemaphore();
await sem.acquire();
// ...
sem.release();
```

## WorkerPool
Pool of `worker_threads` for task execution.

File: `src/primitives/worker-pool.js`

Interface (JS):
- `new WorkerPool(workerNumber, workerPath, workerData?)`
- `submit(data): Promise<any>` — enqueue a task
- `stop()`, `resume()` — control dispatching
- `wait(): Promise<void>` — wait for all pending tasks
- `terminate(): Promise<number>` — terminate workers

```js
const { WorkerPool } = require('dahlia-concurrency');
const path = require('node:path');

const pool = new WorkerPool(2, path.resolve(__dirname, 'worker.js'), { foo: 'bar' });

const result = await pool.submit({ id: 1, data: { x: 42 } });
```

See worker contract in [Contracts](./contracts.md).
