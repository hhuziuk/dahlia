"use strict";

const { Worker } = require("node:worker_threads");

const createSharedArray = (input, typedArrayType) => {
  let typedArray;
  if (Array.isArray(input)) {
    typedArray = new typedArrayType(input);
  } else {
    throw new Error("Input must be an array or a TypedArray");
  }

  const { constructor, length } = typedArray;
  const bytesPerElement = constructor.BYTES_PER_ELEMENT;
  const sharedBuffer = new SharedArrayBuffer(bytesPerElement * length);
  const sharedArray = new constructor(sharedBuffer);

  sharedArray.set(typedArray);

  return {
    sharedBuffer,
    length,
    construct: constructor,
    typeName: constructor.name,
  };
};

const splitSegments = (length, workersCount) => {
  const segments = [];
  const chunkSize = Math.ceil(length / workersCount);

  for (let i = 0; i < length; i += chunkSize) {
    segments.push({
      start: i,
      end: Math.min(i + chunkSize, length),
    });
  }
  return segments;
};

const createWorkers = (
  workerPath,
  workersNumber,
  sharedBuffer,
  length,
  segments,
  typeName,
  isAscending,
) => {
  return new Promise((resolve, reject) => {
    let completed = 0;

    for (let i = 0; i < segments.length; i++) {
      const { start, end } = segments[i];
      const worker = new Worker(workerPath, {
        workerData: {
          sharedBuffer,
          length,
          start,
          end,
          typeName,
          ascending: isAscending,
        },
      });

      worker.on("message", (msg) => {
        if (msg === "sorted") {
          completed++;
          if (completed === segments.length) {
            resolve();
          }
        }
      });

      worker.on("error", reject);

      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }
  });
};

const mergeSortedSegments = (typedArray, segments, compare, typedArrayType) => {
  const result = new typedArrayType(typedArray.length);
  let indices = segments.map((seg) => seg.start);
  let resultIndex = 0;

  while (true) {
    let minIndex = -1;
    let minValue = null;

    for (let i = 0; i < segments.length; i++) {
      if (indices[i] < segments[i].end) {
        if (
          minValue === null ||
          compare(typedArray[indices[i]], minValue) < 0
        ) {
          minValue = typedArray[indices[i]];
          minIndex = i;
        }
      }
    }

    if (minIndex === -1) break;
    result[resultIndex++] = minValue;
    indices[minIndex]++;
  }

  return result;
};

const parallelQuickSort = async (
  data,
  workers = 2,
  typedArrayType,
  compare = (a, b) => a - b,
) => {
  if (data.length < 60000) {
    return data.sort(compare);
  }

  const { sharedBuffer, length, construct, typeName } = createSharedArray(
    data,
    typedArrayType,
  );
  const segments = splitSegments(length, workers);
  const workerPath = __dirname + "/quick-sort.js";

  await createWorkers(
    workerPath,
    segments.length,
    sharedBuffer,
    length,
    segments,
    typeName,
    compare(1, 2) < 0,
  );

  const sharedArray = new construct(sharedBuffer);
  return mergeSortedSegments(sharedArray, segments, compare, typedArrayType);
};

module.exports = parallelQuickSort;
