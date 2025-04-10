const { Worker } = require("node:worker_threads");

const createSharedArray = (input, typedArrayType) => {
  let typedArray = new typedArrayType(input);
  const bytesPerElement = typedArray.BYTES_PER_ELEMENT;
  const sharedBuffer = new SharedArrayBuffer(
    bytesPerElement * typedArray.length,
  );
  const sharedArray = new typedArrayType(sharedBuffer);
  sharedArray.set(typedArray);

  return {
    sharedBuffer,
    length: typedArray.length,
    construct: typedArrayType,
    typeName: typedArrayType.name,
  };
};

const splitSegments = (length, workersCount) => {
  const segments = [];
  const chunkSize = Math.ceil(length / workersCount);

  for (let i = 0; i < length; i += chunkSize) {
    segments.push({ start: i, end: Math.min(i + chunkSize, length) });
  }
  return segments;
};

const createWorkers = (
  workerPath,
  segments,
  sharedBuffer,
  length,
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
          if (completed === segments.length) resolve();
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

const mergeSortedSegments = (
  typedArray,
  segments,
  isAscending,
  typedArrayType,
) => {
  const result = new typedArrayType(typedArray.length);
  let indices = segments.map((seg) => seg.start);
  let resultIndex = 0;
  const compare = isAscending ? (a, b) => a - b : (a, b) => b - a;

  while (true) {
    let minIndex = -1,
      minValue = null;

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
  isAscending = true,
) => {
  if (data.length < 60000) {
    return isAscending
      ? data.sort((a, b) => a - b)
      : data.sort((a, b) => b - a);
  }

  const { sharedBuffer, length, construct, typeName } = createSharedArray(
    data,
    typedArrayType,
  );
  const segments = splitSegments(length, workers);
  const workerPath = __dirname + "/quick-sort-worker.js";

  await createWorkers(
    workerPath,
    segments,
    sharedBuffer,
    length,
    typeName,
    isAscending,
  );
  const sharedArray = new construct(sharedBuffer);

  return mergeSortedSegments(
    sharedArray,
    segments,
    isAscending,
    typedArrayType,
  );
};

module.exports = parallelQuickSort;
