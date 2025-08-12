# Benchmarks

This page lists planned benchmark scenarios and the metrics to visualize. Each section includes a placeholder link to an image inside `docs/graphics/` — attach your charts there with matching filenames.

## Sync Mutex vs Async Mutex
- What: Time for sequential vs. parallel locking with N threads
- Metric: Time vs. Thread Count
- Chart: [graphics/sync-mutex-vs-async-mutex.png](./graphics/sync-mutex-vs-async-mutex.png)

## BinarySemaphore
- What: Time waiting for a single resource
- Metric: Latency vs. Resource Contention
- Chart: [graphics/binary-semaphore.png](./graphics/binary-semaphore.png)

## CountingSemaphore
- What: Time waiting when multiple permits are available
- Metric: Latency vs. Resource Contention
- Chart: [graphics/counting-semaphore.png](./graphics/counting-semaphore.png)

## RwLock (Read/Write Lock)
- What: Time waiting for read vs. write locks
- Metric: Latency vs. Resource Contention
- Chart: [graphics/rw-lock.png](./graphics/rw-lock.png)

## Thread Pool (WorkerPool)
- What: Execution time for 1,000 tasks of varying complexity
- Metric: Execution Time vs. Pool Size
- Chart: [graphics/worker-pool.png](./graphics/worker-pool.png)

## ConcurrentQueue
- What: Number of enqueue/dequeue operations per second
- Metric: Throughput vs. Threads
- Chart: [graphics/concurrent-queue.png](./graphics/concurrent-queue.png)

## ConcurrentPriorityQueue
- What: Number of enqueue/dequeue operations per second
- Metric: Throughput vs. Threads
- Chart: [graphics/concurrent-priority-queue.png](./graphics/concurrent-priority-queue.png)

## ConcurrentSet
- What: Number of insert/remove operations per second
- Metric: Throughput vs. Threads
- Chart: [graphics/concurrent-set.png](./graphics/concurrent-set.png)

## ConcurrentStack
- What: Number of push/pop operations per second
- Metric: Throughput vs. Threads
- Chart: [graphics/concurrent-stack.png](./graphics/concurrent-stack.png)

## ConcurrentDeque
- What: Number of push/pop operations per second at both ends
- Metric: Throughput vs. Threads
- Chart: [graphics/concurrent-deque.png](./graphics/concurrent-deque.png)

## parallelQuickSort
- What: Time to sort arrays of various sizes
- Metric: Time vs. Array Size
- Chart 1: [graphics/parallel-quick-sort.png](./graphics/parallel-quick-sort.png)
- Chart 2: [graphics/parallel-quick-sort-1.png](./graphics/parallel-quick-sort-1.png)
