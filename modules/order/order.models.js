const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    packageId: {
      type: mongoose.Types.ObjectId,
      ref: "Package",  
      required: true,
    },
    transactionId: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction", 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,  
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "cash"],
      required: true,
    },
    notes: {
      type: String,  
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
