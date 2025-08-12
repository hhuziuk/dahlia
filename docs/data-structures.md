# Concurrent data structures

Source: `src/data-structures/`
Types: `types/data-structures/*.d.ts`

## ConcurrentQueue
Thread-safe queue operations.

```js
const { ConcurrentQueue } = require('dahlia-concurrency');
const q = new ConcurrentQueue();
q.enqueue(1);
q.enqueue(2);
const v = q.dequeue();
```

## ConcurrentPriorityQueue
Priority queue with comparator.

```js
const { ConcurrentPriorityQueue } = require('dahlia-concurrency');
const pq = new ConcurrentPriorityQueue((a,b) => a - b);
pq.push(10);
pq.push(1);
const top = pq.pop(); // 1
```

## ConcurrentDeque
Double-ended queue.

```js
const { ConcurrentDeque } = require('dahlia-concurrency');
const d = new ConcurrentDeque();
d.pushFront(1);
d.pushBack(2);
const a = d.popFront();
```

## ConcurrentStack
Thread-safe stack.

```js
const { ConcurrentStack } = require('dahlia-concurrency');
const s = new ConcurrentStack();
s.push(1);
const v = s.pop();
```

## ConcurrentSet
Thread-safe set.

```js
const { ConcurrentSet } = require('dahlia-concurrency');
const set = new ConcurrentSet();
set.add('x');
set.has('x');
```
