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

    return { sharedBuffer, length, construct: constructor, typeName: constructor.name };
}

const splitSegments = (length, workersCount) => {
    const segments = [];
    const chunkSize = Math.ceil(length / workersCount);

    for (let i = 0; i < length; i += chunkSize) {
        segments.push({
            start: i,
            end: Math.min(i + chunkSize, length)
        });
    }
    return segments;
};

const createWorkers = (workerPath, workersNumber, sharedBuffer, length, segments, typeName) => {
    return new Promise((resolve, reject) => {
        let completed = 0;

        for (let i = 0; i < segments.length; i++) {
            const { start, end } = segments[i];
            const worker = new Worker(workerPath, {
                workerData: { sharedBuffer, length, start, end, typeName }
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
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        }
    });
};


const mergeSortedSegments = (typedArray, segments) => {
    const result = new Float64Array(typedArray.length);
    let indices = segments.map(seg => seg.start);
    let resultIndex = 0;

    while (true) {
        let minIndex = -1;
        let minValue = Infinity;

        for (let i = 0; i < segments.length; i++) {
            if (indices[i] < segments[i].end && typedArray[indices[i]] < minValue) {
                minValue = typedArray[indices[i]];
                minIndex = i;
            }
        }

        if (minIndex === -1) break;
        result[resultIndex++] = minValue;
        indices[minIndex]++;
    }

    return result;
};


const parallelQuickSort = async (data, workers = 2, typedArrayType) => {
    if(data.length < 60000){
        return data.sort();
    }
    const { sharedBuffer, length, construct, typeName } = createSharedArray(data, typedArrayType);
    const segments = splitSegments(length, workers);
    const workerPath = "./quick-sort.js";

    await createWorkers(workerPath, segments.length, sharedBuffer, length, segments, typeName);

    const sharedArray = new construct(sharedBuffer);
    const merged = mergeSortedSegments(sharedArray, segments);
    return merged;
};

////// TEST
////// TEST
////// TEST
////// TEST
////// TEST

const quickSort = (array) => {
    if (!Array.isArray(array)) return [];
    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const left = array.filter(num => num < pivot);
    const middle = array.filter(num => num === pivot);
    const right = array.filter(num => num > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
};

const createArrayWithRandomData = (numElements) => {
    const array = [];
    for (let i = 0; i < numElements; i++) {
        array.push(Math.random() * 200 - 100); // Значення від -100 до 100
    }
    return array;
};

const elementSizes = [
    10, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000,
    1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000,
    6000, 7000, 8000, 9000, 10000, 12500, 15000, 17500, 20000, 22500, 25000, 27500, 30000, 32500,
    35000, 37500, 40000, 42500, 45000, 47500, 50000, 60000, 70000, 80000, 90000, 100000, 125000,
    150000, 175000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000,
    900000, 1000000, 1250000, 1500000, 1750000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000,
    5000000, 6000000, 7000000, 8000000, 9000000, 10000000, 12500000, 15000000, 17500000, 20000000,
    25000000, 30000000, 35000000, 40000000, 45000000, 50000000, 60000000, 70000000, 80000000,
    90000000
];

(async () => {
    for (const size of elementSizes) {
        console.log(`\n==== Масив розміром: ${size} елементів ====`);
        const unsorted = createArrayWithRandomData(size);

        try {
            console.time('parallelQuickSort[2]');
            const pQS2sorted = await parallelQuickSort([...unsorted], 2, Float64Array);
            console.timeEnd('parallelQuickSort[2]');

            console.time('parallelQuickSort[3]');
            const pQS3sorted = await parallelQuickSort([...unsorted], 3, Float64Array);
            console.timeEnd('parallelQuickSort[3]');

            console.time('parallelQuickSort[4]');
            const pQS4sorted = await parallelQuickSort([...unsorted], 4, Float64Array);
            console.timeEnd('parallelQuickSort[4]');

            console.time('parallelQuickSort[6]');
            const pQS6sorted = await parallelQuickSort([...unsorted], 6, Float64Array);
            console.timeEnd('parallelQuickSort[6]');

            console.time('parallelQuickSort[8]');
            const pQS8sorted = await parallelQuickSort([...unsorted], 8, Float64Array);
            console.timeEnd('parallelQuickSort[8]');

            console.time('parallelQuickSort[10]');
            const pQS10sorted = await parallelQuickSort([...unsorted], 10, Float64Array);
            console.timeEnd('parallelQuickSort[10]');

            console.time('parallelQuickSort[15]');
            const pQS15sorted = await parallelQuickSort([...unsorted], 15, Float64Array);
            console.timeEnd('parallelQuickSort[15]');

            console.time('simpleQuickSort');
            const sQSsorted = quickSort([...unsorted]);
            console.timeEnd('simpleQuickSort');

            console.time('sort');
            const sSsorted = [...unsorted].sort((a, b) => a - b);
            console.timeEnd('sort');

        } catch (err) {
            console.error('Помилка:', err);
        }
    }
})();
