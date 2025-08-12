# Contracts

This document defines the concrete interaction contracts between components: message shapes, function signatures, arguments, and return values.

## WorkerPool ⇄ Worker (file `src/primitives/worker-pool.js`)

The `WorkerPool` posts tasks to Node.js worker threads and expects standardized responses.

- Incoming message to worker
  - Function: worker message listener
  - Signature: `(message: { id: number; data: any }) => void`
  - Description: The pool sends a message with a unique `id` (callback identifier) and arbitrary `data` payload.

- Outgoing success message from worker
  - Function: `parentPort.postMessage`
  - Arguments: `{ callbackId: number; result: any }`
  - Returns: `void` (posts a message to the parent thread)
  - Description: Must include the same `callbackId` that was received as `id`.

- Outgoing error message from worker
  - Function: `parentPort.postMessage`
  - Arguments: `{ callbackId: number; error: string | { message: string, [k: string]: any } }`
  - Returns: `void`
  - Description: Send when a task fails. Error can be a string or an object with a `message`.

- Worker error/exit handling
  - If a worker emits an `'error'` event, the pool completes the current task promise with `new Error('Worker error: ...')`.
  - If a worker exits with non-zero code, the pool rejects the current task promise with `new Error('Worker stopped with exit code <code>')`.

- WorkerPool API (caller-side expectations)
  - `submit(data: any): Promise<any>`
    - Arguments: `data` will be forwarded to worker as `{ id, data }`.
    - Returns: `Promise<any>` resolved with `result` or rejected with `error` from worker.
  - `stop(): void` — pauses dispatching new tasks.
  - `resume(): void` — resumes dispatching queued tasks.
  - `wait(): Promise<void>` — resolves when all pending tasks complete.
  - `terminate(): Promise<number>` — terminates workers, returns pool size after cleanup (expected 0).

## Scheduler ⇄ Worker (file `src/task-scheduler/worker.js`)

The Scheduler builds on top of the WorkerPool and defines a specific task protocol.

- Incoming message to scheduler worker
  - Signature: `(message: { id: number; data: { type: string; payload: any } }) => void`
  - Description: `type` is the task name. `payload` is the task input object.

- Special request handshake (optional)
  - If `type === 'request'`, the worker should respond immediately with `{ callbackId, type: 'request' }` and return.

- Unknown task type
  - Outgoing message: `{ callbackId: number; error: { message: string } }`
  - Required when `handlers[type]` is not found. The message must include a helpful `message` string: `Unknown task type "<type>"`.

- Successful task execution
  - The worker resolves the handler call and posts `{ callbackId: number; result: any }`.

- Failed task execution
  - The worker catches the error and posts `{ callbackId: number; error: string }` where `error` is typically `err.message`.

## Handlers module (task handlers)

A handlers module is a plain CommonJS file that exports an object mapping task names to functions.

- Module shape
  - `module.exports = { [taskName: string]: (payload: any) => any | Promise<any> }`

- Handler function
  - Name: `taskName` (string key in the exported object)
  - Signature: `(payload: any) => any | Promise<any>`
  - Arguments: `payload` — arbitrary serializable input for the task
  - Returns: Either a direct value or a promise resolving to the task result

- Example
  ```js
  module.exports = {
    add: ({ a, b }) => a + b,
    multiply: async ({ a, b }) => a * b,
  };
  ```

## Data structure contracts

Concurrency-safe operations are guaranteed within a single Node.js process. Do not mutate internal buffers/collections directly; use the provided methods.

## Performance guidance

- Use `CountingSemaphore` to bound concurrent IO.
- Use `WorkerPool`/`Scheduler` for CPU-bound tasks.
