const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    checkoutSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    order_id:{
      type: mongoose.Types.ObjectId
    },
    status: {
      type: String,
      required: true,
      enum: ["succeeded", "pending", "failed"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
