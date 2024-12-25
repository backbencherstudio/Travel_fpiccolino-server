const { parentPort, workerData } = require("worker_threads");

// Execute the email sending
sendEmail(workerData)
  .then((info) => {
    parentPort.postMessage({ success: true, message: info });
  })
  .catch((error) => {
    parentPort.postMessage({ success: false, message: error.message });
  });
