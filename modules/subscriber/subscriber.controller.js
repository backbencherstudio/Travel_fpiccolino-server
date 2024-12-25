const Subscriber = require("./subscriber.model");

const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({
      message: "Subscribed successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error subscribing", error: error.message });
  }
};

const getAllSubscriber = async (req, res) => {
  try {
    const categories = await Subscriber.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subscriber", error: error.message });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const id = req.params.id;
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

module.exports = {
  createSubscriber,
  getAllSubscriber,
  deleteSubscriber,
};
