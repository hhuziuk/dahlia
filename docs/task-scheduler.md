# Task Scheduler (Scheduler)

Source: `src/task-scheduler/`
Types: `types/task-scheduler/task-scheduler.d.ts`

`Scheduler` provides a simple way to run named tasks in worker threads.

## Example
```js
const path = require('node:path');
const { Scheduler } = require('dahlia-concurrency');

// handlers.js
// module.exports = { add: ({a,b}) => a + b };

const scheduler = new Scheduler(2, path.resolve(__dirname, 'handlers.js'));
scheduler.start();

const sum = await scheduler.runTask('add', { a: 2, b: 3 }); // 5
await scheduler.stop();
```

## API
- `new Scheduler(numWorkers: number, modulePath: string)` — `modulePath` points to a module exporting a map of handlers.
- `start(): void` — starts dispatching.
- `runTask(name: string, payload: object): Promise<any>` — executes a task by name with payload.
- `stop(): Promise<void>` — terminates the worker pool.

## Handler contract
In the file you pass to `modulePath`, export an object where the key is the task name and the value is the handler function:

```js
module.exports = {
  myTask: async (payload) => {
    // ...
    return result;
  },
};
```

See also [Contracts](./contracts.md).
