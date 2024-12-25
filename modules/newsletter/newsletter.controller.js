const { sendEmail } = require("../../util/otpUtils");
const Subscriber = require("./newsletter.model");

const sendNewsletter = async (req, res) => {
  try {
    const { title, content } = req.body;
    // Send newsletter to all subscribers
    const subscribers = await Subscriber.find();
    subscribers.forEach(async (subscriber) => {
      return new Promise(async (resolve, reject) => {
        try {
          const data = {
            email: subscriber.email,
            title,
            content,
          };
          const worker = new Worker("./emailWorker.js", {
            workerData: data,
          });

          worker.on("message", (message) => {
            if (message.success) {
              resolve();
            } else {
              reject(new Error(message.message));
            }
          });

          worker.on("error", (error) => {
            reject(error);
          });

          worker.on("exit", (code) => {
            if (code !== 0) {
              reject(new Error(`Worker stopped with exit code ${code}`));
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    res.status(201).json({
      message: "Newsletter sent successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error sending newsletter", error: error.message });
  }
};

module.exports = {
  sendNewsletter,
};
