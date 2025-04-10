const { expect } = require("chai");
const { MessageChannel, MessagePort } = require("node:worker_threads");
const {
  createParallelPipeline,
} = require("../../../src/methods/parallel-pipeline/pipeline.js");

class MockWorker {
  constructor() {
    this.messages = [];
  }

  postMessage(message, transferList) {
    this.messages.push({ message, transferList });
  }
}

describe("createParallelPipeline", function () {
  it("should throw an error if workers is not an array", function () {
    expect(() => createParallelPipeline({}, "data")).to.throw(
      "workers is not an array!",
    );
  });

  it("should throw an error if less than two workers are provided", function () {
    expect(() => createParallelPipeline([new MockWorker()], "data")).to.throw(
      "should be at least two workers!",
    );
  });

  it("should setup pipeline correctly for two workers", function () {
    const worker1 = new MockWorker();
    const worker2 = new MockWorker();
    const transferData = "testData";

    const workers = createParallelPipeline([worker1, worker2], transferData);

    expect(workers).to.be.an("array").with.lengthOf(2);

    expect(worker1.messages).to.have.lengthOf(2);

    const firstMsgW1 = worker1.messages[0].message;
    expect(firstMsgW1).to.have.property("func", "send");
    expect(firstMsgW1).to.have.property("port");
    expect(firstMsgW1.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );

    const secondMsgW1 = worker1.messages[1].message;
    expect(secondMsgW1).to.deep.equal({ data: transferData });

    expect(worker2.messages).to.have.lengthOf(1);
    const firstMsgW2 = worker2.messages[0].message;
    expect(firstMsgW2).to.have.property("func", "receive");
    expect(firstMsgW2).to.have.property("port");
    expect(firstMsgW2.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );
  });

  it("should setup pipeline correctly for three workers", function () {
    const worker1 = new MockWorker();
    const worker2 = new MockWorker();
    const worker3 = new MockWorker();
    const transferData = { value: 123 };

    const workers = createParallelPipeline(
      [worker1, worker2, worker3],
      transferData,
    );
    expect(workers).to.be.an("array").with.lengthOf(3);

    expect(worker1.messages).to.have.lengthOf(2);
    expect(worker1.messages[0].message).to.have.property("func", "send");
    expect(worker1.messages[0].message).to.have.property("port");
    expect(worker1.messages[0].message.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );
    expect(worker1.messages[1].message).to.deep.equal({ data: transferData });

    expect(worker2.messages).to.have.lengthOf(2);
    expect(worker2.messages[0].message).to.have.property("func", "receive");
    expect(worker2.messages[0].message).to.have.property("port");
    expect(worker2.messages[0].message.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );
    expect(worker2.messages[1].message).to.have.property("func", "send");
    expect(worker2.messages[1].message).to.have.property("port");
    expect(worker2.messages[1].message.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );

    expect(worker3.messages).to.have.lengthOf(1);
    expect(worker3.messages[0].message).to.have.property("func", "receive");
    expect(worker3.messages[0].message).to.have.property("port");
    expect(worker3.messages[0].message.port).to.satisfy(
      (port) =>
        port instanceof MessagePort || (port && port.onmessage !== undefined),
    );
  });
});
