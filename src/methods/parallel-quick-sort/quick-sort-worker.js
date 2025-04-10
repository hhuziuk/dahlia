const { parentPort, workerData } = require("node:worker_threads");
const typeConstructors = require("./type-constructors");

const quickSortWorker = (arr, left, right, ascending) => {
  const compare = ascending ? (a, b) => a - b : (a, b) => b - a;

  if (right - left < 16) {
    for (let i = left + 1; i <= right; i++) {
      let temp = arr[i],
        j = i - 1;
      while (j >= left && compare(arr[j], temp) > 0) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = temp;
    }
    return;
  }

  const pivot = arr[Math.floor((left + right) / 2)];
  let i = left,
    j = right;

  while (i <= j) {
    while (compare(arr[i], pivot) < 0) i++;
    while (compare(arr[j], pivot) > 0) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }

  if (left < j) quickSortWorker(arr, left, j, ascending);
  if (i < right) quickSortWorker(arr, i, right, ascending);
};

(() => {
  const { sharedBuffer, typeName, start, end, ascending } = workerData;
  const construct = typeConstructors[typeName];

  if (!construct) throw new Error(`Unsupported type: ${typeName}`);

  const typedArray = new construct(sharedBuffer);
  const segment = typedArray.subarray(start, end);

  quickSortWorker(segment, 0, segment.length - 1, ascending);
  parentPort.postMessage("sorted");
})();
