const mongoose = require("mongoose");

const CheckoutTempSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    packageId: { type: mongoose.Types.ObjectId, ref: "Package" },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    // Optional TTL to auto-expire temp sessions (e.g., 24 hours)
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: 0 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckoutTemp", CheckoutTempSchema);
