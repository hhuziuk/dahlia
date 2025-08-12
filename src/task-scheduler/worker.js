const { parentPort, workerData } = require("worker_threads");
const path = require("node:path");

let handlers = {};
try {
  handlers = require(path.resolve(workerData.modulePath));
} catch (err) {
  console.error("Failed to load handlers module:", err);
  process.exit(1);
}

parentPort.on("message", (task) => {
  const callbackId = task.id;
  const { type, payload } = task.data;

  if (type === "request") {
    parentPort.postMessage({ callbackId, type: "request" });
    return;
  }

  if (!handlers[type]) {
    parentPort.postMessage({
      callbackId,
      error: { message: `Unknown task type "${type}"` },
    });
    return;
  }

  Promise.resolve()
    .then(() => handlers[type](payload))
    .then((result) => {
      parentPort.postMessage({ callbackId, result });
    })
    .catch((err) => {
      parentPort.postMessage({ callbackId, error: err.message });
    });
});
