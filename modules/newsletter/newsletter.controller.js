const { sendEmail } = require("../../util/otpUtils");
const Subscriber = require("../subscriber/subscriber.model");
const newsLetterSchema = require("./newsLetter.modes");
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

const createNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "News letterdata is missing" });
    }

    const newNewsLetter = new newsLetterSchema({
      email,
      name,
    });

    await newNewsLetter.save();
    res
      .status(200)
      .json({
        message: "Newsletter subscription created successfully!",
        success: true,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllNewsLetter = async (req, res) => {
  try {
    const all = await newsLetterSchema.find();
    res.status(200).json(all);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteNewsLetter = async (req, res) => {
  try {
    const newsletterId = req.params.id;
    console.log(newsletterId)
    if (!newsletterId) {
      return res.status(400).json({ error: "Newsletter ID is required" });
    }
    const deletedNewsLetter = await newsLetterSchema.findByIdAndDelete(
      newsletterId
    );
    if (!deletedNewsLetter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    return res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendNewsletter,
  createNewsletter,
  getAllNewsLetter,
  deleteNewsLetter,
};
