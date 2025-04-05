"use strict";

const { MessageChannel } = require("node:worker_threads");

function createParallelPipeline(workers, transferData) {
  if (!Array.isArray(workers)) {
    throw new Error("workers is not an array!");
  }
  if (workers.length < 2) {
    throw new Error("should be at least two workers!");
  }

  for (let i = 0; i < workers.length - 1; i++) {
    const { port1, port2 } = new MessageChannel();

    workers[i].postMessage({ port: port1, func: "send" }, [port1]); // send
    workers[i + 1].postMessage({ port: port2, func: "receive" }, [port2]); // receive
  }

  workers[0].postMessage({ data: transferData });

  return workers;
}

module.exports = { createParallelPipeline };
