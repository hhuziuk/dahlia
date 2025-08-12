const {
  ConcurrentDeque,
} = require("../../src/data-structures/concurrent-dequeue");
const { expect } = require("chai");

describe("ConcurrentDeque", () => {
  let deque;

  beforeEach(() => {
    deque = new ConcurrentDeque();
  });

  it("initial state is empty", () => {
    expect(deque.isEmpty()).to.be.true;
    expect(deque.size).to.equal(0);
    expect(deque.peekFront()).to.be.null;
    expect(deque.peekBack()).to.be.null;
  });

  it("enqueueFront adds items to front", () => {
    deque.enqueueFront(1);
    expect(deque.peekFront()).to.equal(1);
    expect(deque.peekBack()).to.equal(1);
    expect(deque.size).to.equal(1);
    deque.enqueueFront(2);
    expect(deque.peekFront()).to.equal(2);
    expect(deque.peekBack()).to.equal(1);
    expect(deque.size).to.equal(2);
  });

  it("enqueueBack adds items to back", () => {
    deque.enqueueBack("a");
    expect(deque.peekFront()).to.equal("a");
    expect(deque.peekBack()).to.equal("a");
    expect(deque.size).to.equal(1);
    deque.enqueueBack("b");
    expect(deque.peekFront()).to.equal("a");
    expect(deque.peekBack()).to.equal("b");
    expect(deque.size).to.equal(2);
  });

  it("dequeueFront removes from front", () => {
    deque.enqueueBack(1);
    deque.enqueueBack(2);
    expect(deque.dequeueFront()).to.equal(1);
    expect(deque.size).to.equal(1);
    expect(deque.peekFront()).to.equal(2);
    expect(deque.peekBack()).to.equal(2);
    expect(deque.dequeueFront()).to.equal(2);
    expect(deque.isEmpty()).to.be.true;
    expect(deque.dequeueFront()).to.be.null;
  });

  it("dequeueBack removes from back", () => {
    deque.enqueueFront(1);
    deque.enqueueFront(2);
    expect(deque.dequeueBack()).to.equal(1);
    expect(deque.size).to.equal(1);
    expect(deque.peekFront()).to.equal(2);
    expect(deque.peekBack()).to.equal(2);
    expect(deque.dequeueBack()).to.equal(2);
    expect(deque.isEmpty()).to.be.true;
    expect(deque.dequeueBack()).to.be.null;
  });

  it("mixed enqueue/dequeue operations maintain correct order", () => {
    deque.enqueueBack(10);
    deque.enqueueFront(20);
    deque.enqueueBack(30);
    // deque now: [20, 10, 30]
    expect(deque.peekFront()).to.equal(20);
    expect(deque.peekBack()).to.equal(30);
    expect(deque.dequeueFront()).to.equal(20);
    // [10, 30]
    expect(deque.dequeueBack()).to.equal(30);
    // [10]
    expect(deque.peekFront()).to.equal(10);
    expect(deque.peekBack()).to.equal(10);
    expect(deque.size).to.equal(1);
  });

  it("size and isEmpty update correctly", () => {
    expect(deque.isEmpty()).to.be.true;
    deque.enqueueFront("x");
    expect(deque.isEmpty()).to.be.false;
    expect(deque.size).to.equal(1);
    deque.enqueueBack("y");
    expect(deque.size).to.equal(2);
    deque.dequeueFront();
    expect(deque.size).to.equal(1);
    deque.dequeueBack();
    expect(deque.size).to.equal(0);
    expect(deque.isEmpty()).to.be.true;
  });
});
