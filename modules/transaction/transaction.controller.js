const Transaction = require("./transaction.model");

const getAllTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find();
    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting transaction", error: error.message });
  }
};

// searcg transaction by paymentIntentId and checkoutSessionId and customer
const searchTransaction = async (req, res) => {
  try {
    const { paymentIntentId, checkoutSessionId, customer } = req.query;
    let transaction = await Transaction.find();
    if (paymentIntentId) {
      transaction = await Transaction.find({ paymentIntentId });
    }
    if (checkoutSessionId) {
      transaction = await Transaction.find({ checkoutSessionId });
    }
    if (customer) {
      transaction = await Transaction.find({ customer });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

module.exports = {
  getAllTransaction,
  deleteTransaction,
  searchTransaction,
};
