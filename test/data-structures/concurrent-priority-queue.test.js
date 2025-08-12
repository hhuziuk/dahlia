const { expect } = require("chai");
const {
  ConcurrentPriorityQueue,
} = require("../../src/data-structures/concurrent-priority-queue.js");

describe("ConcurrentPriorityQueue", function () {
  let queue;

  beforeEach(() => {
    queue = new ConcurrentPriorityQueue();
  });

  it("should start empty", () => {
    expect(queue.size).to.equal(0);
    expect(queue.isEmpty()).to.be.true;
    expect(queue.peek()).to.equal(null);
    expect(queue.dequeue()).to.equal(null);
  });

  it("should enqueue and dequeue items by priority", () => {
    queue.enqueue("low", 1);
    queue.enqueue("medium", 5);
    queue.enqueue("high", 10);

    expect(queue.size).to.equal(3);
    expect(queue.peek()).to.equal("high"); // highest priority first

    const first = queue.dequeue();
    expect(first).to.equal("high");

    const second = queue.dequeue();
    expect(second).to.equal("medium");

    const third = queue.dequeue();
    expect(third).to.equal("low");

    expect(queue.isEmpty()).to.be.true;
  });

  it("should handle enqueue and dequeue interleaved", () => {
    queue.enqueue("first", 1);
    expect(queue.dequeue()).to.equal("first");
    expect(queue.dequeue()).to.equal(null);

    queue.enqueue("second", 2);
    queue.enqueue("third", 3);
    expect(queue.dequeue()).to.equal("third");
    queue.enqueue("fourth", 5);
    expect(queue.dequeue()).to.equal("fourth");
    expect(queue.dequeue()).to.equal("second");
  });

  it("should behave correctly under concurrent access", async () => {
    const NUM_WRITES = 50;
    const NUM_READS = 25;

    const enqueuePromises = Array.from({ length: NUM_WRITES }, (_, i) =>
      Promise.resolve().then(() => queue.enqueue(`item${i}`, i)),
    );

    await Promise.all(enqueuePromises);

    expect(queue.size).to.equal(NUM_WRITES);

    const dequeueResults = [];
    const dequeuePromises = Array.from({ length: NUM_READS }, () =>
      Promise.resolve().then(() => {
        const val = queue.dequeue();
        if (val !== null) dequeueResults.push(val);
      }),
    );

    await Promise.all(dequeuePromises);

    expect(dequeueResults.length).to.equal(NUM_READS);
    expect(queue.size).to.equal(NUM_WRITES - NUM_READS);

    const priorities = dequeueResults.map((item) =>
      parseInt(item.replace("item", ""), 10),
    );
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i - 1]).to.be.greaterThan(priorities[i]);
    }
  });
});
