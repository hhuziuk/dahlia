const { parentPort, workerData } = require("node:worker_threads");
const typeConstructors = require("./typedArrays");

const medianOfThree = (arr, left, right) => {
    const mid = Math.floor((left + right) / 2);
    const a = arr[left], b = arr[mid], c = arr[right];

    if ((a > b) !== (a > c)) return a;
    if ((b > a) !== (b > c)) return b;
    return c;
};

const quickSort = (arr, left, right) => {
    // insertion sort
    if (right - left < 16) {
        for (let i = left + 1; i <= right; i++) {
            let temp = arr[i], j = i - 1;
            while (j >= left && arr[j] > temp) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = temp;
        }
        return;
    }

    const pivot = medianOfThree(arr, left, right);
    let i = left, j = right;

    while (i <= j) {
        while (arr[i] < pivot) i++;
        while (arr[j] > pivot) j--;
        if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
            j--;
        }
    }

    if (left < j) quickSort(arr, left, j);
    if (i < right) quickSort(arr, i, right);
};

(() => {
    const { sharedBuffer, typeName, start, end } = workerData;
    const construct = typeConstructors[typeName];

    if (!construct) {
        throw new Error(`Unsupported type: ${typeName}`);
    }

    const typedArray = new construct(sharedBuffer);
    const segment = typedArray.subarray(start, end);

    quickSort(segment, 0, segment.length - 1);

    parentPort.postMessage("sorted");
})();
