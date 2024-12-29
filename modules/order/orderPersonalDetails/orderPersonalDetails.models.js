const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderPersonalDetailsSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    // 1 = yes, 2 = no
    physicalIssues: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrderPersonalDetails",
  OrderPersonalDetailsSchema
);
