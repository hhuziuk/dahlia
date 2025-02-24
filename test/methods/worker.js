const { parentPort } = require("node:worker_threads");

let inputPort = null;
let outputPort = null;

function processData(data) {
  const result = new Int32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] + 1;
  }
  return result;
}

parentPort.on("message", (message) => {
  if (message.port && message.func) {
    if (message.func === "receive") {
      inputPort = message.port;
      inputPort.on("message", (data) => {
        const processed = processData(data);
        outputPort
          ? outputPort.postMessage(processed)
          : parentPort.postMessage({ result: processed });
      });
    } else if (message.func === "send") {
      outputPort = message.port;
    }
  } else if (message.data) {
    const data = message.data;
    const processed = processData(data);
    outputPort
      ? outputPort.postMessage(processed)
      : parentPort.postMessage({ result: processed });
  }
});
