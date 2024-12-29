const OrderPersonalDetails = require("./orderPersonalDetails.models");

const create = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, physicalIssues } =
      req.body;

    const orderId = req.params.orderId;
    const userId = req.userId;

    const orderPersonalDetails = new OrderPersonalDetails({
      userId,
      orderId,
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      physicalIssues,
    });
    await orderPersonalDetails.save();

    res.status(201).json({
      message: "Record created successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating record", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await OrderPersonalDetails.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching", error: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const orderPersonalDetails = await OrderPersonalDetails.findByIdAndDelete(
      id
    );
    if (!orderPersonalDetails) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting record", error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  deleteById,
};
