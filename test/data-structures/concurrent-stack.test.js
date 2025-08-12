const {
  ConcurrentStack,
} = require("../../src/data-structures/concurrent-stack.js");
const { expect } = require("chai");

describe("ConcurrentStack", () => {
  let stack;

  beforeEach(() => {
    stack = new ConcurrentStack();
  });

  it("initial state is empty", () => {
    expect(stack.isEmpty()).to.be.true;
    expect(stack.size).to.equal(0);
    expect(stack.peek()).to.be.null;
  });

  it("push adds items to the top", () => {
    stack.push(1);
    expect(stack.peek()).to.equal(1);
    expect(stack.size).to.equal(1);
    stack.push(2);
    expect(stack.peek()).to.equal(2);
    expect(stack.size).to.equal(2);
  });

  it("pop removes items from the top", () => {
    stack.push("a");
    stack.push("b");
    expect(stack.pop()).to.equal("b");
    expect(stack.size).to.equal(1);
    expect(stack.peek()).to.equal("a");
    expect(stack.pop()).to.equal("a");
    expect(stack.isEmpty()).to.be.true;
    expect(stack.pop()).to.be.null;
  });

  it("peek does not remove item", () => {
    stack.push(42);
    const firstPeek = stack.peek();
    expect(firstPeek).to.equal(42);
    expect(stack.size).to.equal(1);
    const secondPeek = stack.peek();
    expect(secondPeek).to.equal(42);
    expect(stack.size).to.equal(1);
  });

  it("size and isEmpty update correctly after mixed operations", () => {
    expect(stack.isEmpty()).to.be.true;
    stack.push("x");
    expect(stack.isEmpty()).to.be.false;
    expect(stack.size).to.equal(1);
    stack.push("y");
    expect(stack.size).to.equal(2);
    stack.pop();
    expect(stack.size).to.equal(1);
    stack.pop();
    expect(stack.size).to.equal(0);
    expect(stack.isEmpty()).to.be.true;
  });

  it("push/pop sequence maintains correct LIFO order", () => {
    const sequence = [1, 2, 3, 4, 5];
    sequence.forEach((n) => stack.push(n));
    expect(stack.size).to.equal(sequence.length);
    const out = [];
    while (!stack.isEmpty()) {
      out.push(stack.pop());
    }
    expect(out).to.deep.equal(sequence.slice().reverse());
  });
});
