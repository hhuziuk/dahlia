# Methods

Source: `src/methods/`
Types: `types/methods/**/*`

## parallelPipeline
File: `src/methods/parallel-pipeline/pipeline.js`

Multi-stage data processing pipeline with parallelism.

```js
const { parallelPipeline } = require('dahlia-concurrency');

const stages = [
  async (x) => x + 1,
  async (x) => x * 2,
];

const results = await parallelPipeline([1,2,3], stages, { concurrency: 2 });
```

## parallelQuickSort and utilities
Files: `src/methods/parallel-quick-sort/*`

```js
const { parallelQuickSort } = require('dahlia-concurrency');
const arr = [5,3,8,1];
const sorted = await parallelQuickSort(arr);
```

Additionally exported: `quick-sort-worker`, `type-constructors`.
