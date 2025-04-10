const { expect } = require("chai");
const {ConcurrentQueue} = require("../../src/data-structures/concurrent-queue");

describe("ConcurrentQueue", function () {
    let queue;

    beforeEach(() => {
        queue = new ConcurrentQueue();
    });

    it("should start empty", () => {
        expect(queue.size).to.equal(0);
        expect(queue.isEmpty()).to.be.true;
        expect(queue.peek()).to.equal(null);
        expect(queue.dequeue()).to.equal(null);
    });

    it("should enqueue and dequeue items correctly", () => {
        queue.enqueue("first");
        queue.enqueue("second");

        expect(queue.size).to.equal(2);
        expect(queue.peek()).to.equal("first");

        const first = queue.dequeue();
        expect(first).to.equal("first");

        const second = queue.dequeue();
        expect(second).to.equal("second");

        expect(queue.isEmpty()).to.be.true;
    });

    it("should handle enqueue and dequeue interleaved", () => {
        queue.enqueue(1);
        expect(queue.dequeue()).to.equal(1);
        expect(queue.dequeue()).to.equal(null);

        queue.enqueue(2);
        queue.enqueue(3);
        expect(queue.dequeue()).to.equal(2);
        queue.enqueue(4);
        expect(queue.dequeue()).to.equal(3);
        expect(queue.dequeue()).to.equal(4);
    });

    it("should behave correctly under concurrent access", async () => {
        const NUM_WRITES = 50;
        const NUM_READS = 25;

        const enqueuePromises = Array.from({ length: NUM_WRITES }, (_, i) =>
            Promise.resolve().then(() => queue.enqueue(i))
        );

        await Promise.all(enqueuePromises);

        expect(queue.size).to.equal(NUM_WRITES);

        const dequeueResults = [];
        const dequeuePromises = Array.from({ length: NUM_READS }, () =>
            Promise.resolve().then(() => {
                const val = queue.dequeue();
                if (val !== null) dequeueResults.push(val);
            })
        );

        await Promise.all(dequeuePromises);

        expect(dequeueResults.length).to.equal(NUM_READS);
        expect(queue.size).to.equal(NUM_WRITES - NUM_READS);
    });
});
