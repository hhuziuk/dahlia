module.exports = {
  // Data structures
  ConcurrentPriorityQueue:
    require("./src/data-structures/concurrent-priority-queue.js")
      .ConcurrentPriorityQueue,
  ConcurrentQueue: require("./src/data-structures/concurrent-queue.js")
    .ConcurrentQueue,
  ConcurrentSet: require("./src/data-structures/concurrent-set.js")
    .ConcurrentSet,
  ConcurrentDeque: require("./src/data-structures/concurrent-dequeue.js")
    .ConcurrentDeque,
  ConcurrentStack: require("./src/data-structures/concurrent-stack.js")
    .ConcurrentStack,

  // Methods - re-export all named exports
  ...require("./src/methods/parallel-pipeline/pipeline.js"),
  ...require("./src/methods/parallel-quick-sort/parallel-quick-sort.js"),
  ...require("./src/methods/parallel-quick-sort/quick-sort-worker.js"),
  ...require("./src/methods/parallel-quick-sort/type-constructors.js"),

  // Primitives
  Mutex: require("./src/primitives/mutex.js").Mutex,
  RwLock: require("./src/primitives/rw-lock.js").RwLock,
  WorkerPool: require("./src/primitives/worker-pool.js").WorkerPool,
  CountingSemaphore: require("./src/primitives/counting-semaphore.js")
    .CountingSemaphore,
  BinarySemaphore: require("./src/primitives/binary-semaphore.js")
    .BinarySemaphore,

  // Task scheduler
  Scheduler: require("./src/task-scheduler/scheduler.js").Scheduler,
};
