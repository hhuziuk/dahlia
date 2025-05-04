| Category               | Primitive               | Implementation | Types | Test |
|------------------------|-------------------------|------------|----|---|
| **Mutexes**            | sync mutex              | ✅          | ✅  | ✅ |
|                        | async mutex             | ✅          | ✅  | ✅ |
| **Semaphores**         | binarySemaphore         | ✅          | ✅  | ✅ |
|                        | countingSemaphore       | ✅          | ✅  | ✅ |
| **Locks**              | rwLock                  | ✅          | ✅  | ✅ |
| **Primitives**         | thread pool             | ✅          | ✅  | ✅ |
| **Data structures**    | concurrentQueue         | ✅          | ✅  | ✅ |
|                        | concurrentPriorityQueue | ✅          | ✅  | ✅ |
|                        | concurrentSet           | ✅          | ✅  | ✅ |
|                        | concurrentStack         | ✅          | ✅  |  ✅ |
|                        | concurrentDeque         | ✅          | ✅  | ✅ |
| **Computation Models** | parallelPipeline        | ✅          | ✅  | ✅ |
|                        | parallelQuickSort       | ✅          | ✅  | ✅ |
| **Task scheduler**     |         |            |    |   |





```js
┌─────────┬────────────┬──────────────┬───────────────┬────────────────┬─────────────────┐
│ (index) │ iterations │ fairReadTime │ fairWriteTime │ greedyReadTime │ greedyWriteTime │
├─────────┼────────────┼──────────────┼───────────────┼────────────────┼─────────────────┤
│ 0       │ 10         │ '0.09ms'     │ '0.05ms'      │ '0.03ms'       │ '0.03ms'        │
│ 1       │ 50         │ '0.12ms'     │ '0.09ms'      │ '0.05ms'       │ '0.03ms'        │
│ 2       │ 100        │ '0.08ms'     │ '0.05ms'      │ '0.05ms'       │ '0.03ms'        │
│ 3       │ 500        │ '0.29ms'     │ '0.23ms'      │ '0.23ms'       │ '0.13ms'        │
│ 4       │ 1000       │ '0.29ms'     │ '0.26ms'      │ '0.23ms'       │ '0.17ms'        │
│ 5       │ 5000       │ '1.44ms'     │ '1.21ms'      │ '1.20ms'       │ '0.70ms'        │
│ 6       │ 10000      │ '2.51ms'     │ '1.72ms'      │ '1.78ms'       │ '1.16ms'        │
│ 7       │ 50000      │ '10.83ms'    │ '7.39ms'      │ '7.32ms'       │ '4.86ms'        │
│ 8       │ 100000     │ '18.96ms'    │ '13.91ms'     │ '14.09ms'      │ '9.47ms'        │
│ 9       │ 500000     │ '100.21ms'   │ '69.51ms'     │ '71.78ms'      │ '47.45ms'       │
│ 10      │ 1000000    │ '193.61ms'   │ '139.98ms'    │ '143.21ms'     │ '97.50ms'       │
│ 11      │ 5000000    │ '957.10ms'   │ '697.08ms'    │ '714.99ms'     │ '477.41ms'      │
│ 12      │ 10000000   │ '1909.69ms'  │ '1394.81ms'   │ '1563.60ms'    │ '975.15ms'      │
│ 13      │ 50000000   │ '9700.71ms'  │ '7056.98ms'   │ '7164.75ms'    │ '4794.46ms'     │
└─────────┴────────────┴──────────────┴───────────────┴────────────────┴─────────────────┘

```


