const { parentPort } = require("node:worker_threads");

parentPort.on("message", ({ id, data }) => {
  parentPort.postMessage({ callbackId: id, result: data * data });
});
