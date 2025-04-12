const { RwLock } = require("../primitives/rw-lock");

class ListNode {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

class ConcurrentPriorityQueue {
    #values = [];

    constructor(strategy = "max") {
        this.readerBuffer = new SharedArrayBuffer(4);
        this.writerBuffer = new SharedArrayBuffer(4);
        this.rwLock = new RwLock(this.readerBuffer, this.writerBuffer, true);

        if (strategy !== "max" && strategy !== "min") {
            throw new Error("Invalid strategy: must be 'max' or 'min'");
        }
        this.strategy = strategy;
    }

    enqueue(item, priority) {
        const newNode = new ListNode(item, priority);
        this.rwLock.writeLock();
        try {
            this.#values.push(newNode);
            this.#bubbleUp();
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.writeUnlock();
        }
    }
    dequeue() {
        this.rwLock.writeLock();
        try {
            if (this.#values.length === 0) return null;
            const max = this.#values[0];
            const end = this.#values.pop();
            if (this.#values.length > 0) {
                this.#values[0] = end;
                this.#sinkDown();
            }
            return max.element;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.writeUnlock();
        }
    }

    peek() {
        this.rwLock.readLock();
        try {
            return this.#values.length > 0 ? this.#values[0].element : null;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.readUnlock();
        }
    }

    get size() {
        this.rwLock.readLock();
        try {
            return this.#values.length;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.readUnlock();
        }
    }

    isEmpty() {
        this.rwLock.readLock();
        try {
            return this.#values.length === 0;
        } catch (e) {
            throw e;
        } finally {
            this.rwLock.readUnlock();
        }
    }

    #bubbleUp() {
        let idx = this.#values.length - 1;
        const element = this.#values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.#values[parentIdx];
            if (this.#compare(parent, element)) break;
            this.#values[parentIdx] = element;
            this.#values[idx] = parent;
            idx = parentIdx;
        }
    }

    #compare(a, b) {
        if (this.strategy === "max") {
            return a.priority > b.priority;
        } else { // strategy === "min"
            return a.priority < b.priority;
        }
    }

    #sinkDown() {
        let idx = 0;
        const length = this.#values.length;
        const element = this.#values[0];

        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.#values[leftChildIdx];
                if (!this.#compare(element, leftChild)) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.#values[rightChildIdx];
                if (
                    (swap === null && !this.#compare(element, rightChild)) ||
                    (swap !== null && !this.#compare(leftChild, rightChild))
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.#values[idx] = this.#values[swap];
            this.#values[swap] = element;
            idx = swap;
        }
    }
}

module.exports = { ConcurrentPriorityQueue };