const { describe, it } = require("mocha");
const { strictEqual } = require("node:assert");

const testArray100 = require("./test-arrays/test-array-100.js");
const testArray1000 = require("./test-arrays/test-array-1000.js");
const testArray10000 = require("./test-arrays/test-array-10000.js");
const testArray100000 = require("./test-arrays/test-array-100000.js");
const testArray1000000 = require("./test-arrays/test-array-1000000.js");

const testArray100Sorted = require("./test-arrays/test-array-100-sorted.js");
const testArray1000Sorted = require("./test-arrays/test-array-1000-sorted.js");
const testArray10000Sorted = require("./test-arrays/test-array-10000-sorted.js");
const testArray100000Sorted = require("./test-arrays/test-array-100000-sorted.js");
const testArray1000000Sorted = require("./test-arrays/test-array-1000000-sorted.js");

const parallelQuickSort = require("../../src/methods/parallel-quick-sort/parallel-quick-sort");

function arraysAreEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      console.log(
          `Mismatch at index ${i}: a[${i}] = ${a[i]}, b[${i}] = ${b[i]}`
      );
      return false;
    }
  }
  return true;
}

function testSorting(unsortedArray, expectedSortedArray, size) {
  it(`should correctly sort ${size} elements`, async () => {
    const result = await parallelQuickSort(
        [...unsortedArray],
        2,
        Int32Array,
        true
    );
    strictEqual(
        arraysAreEqual(result, expectedSortedArray),
        true,
        `Sorted arrays are not equal for size ${size}`
    );
  });
}

describe("Async Parallel Quick Sort", function () {
  this.timeout(10000);

  testSorting(testArray100, testArray100Sorted, 100);
  testSorting(testArray1000, testArray1000Sorted, 1000);
  testSorting(testArray10000, testArray10000Sorted, 10000);
  testSorting(testArray100000, testArray100000Sorted, 100000);
  testSorting(testArray1000000, testArray1000000Sorted, 1000000);
});
