const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Candidate information",
        "Newsletter information",
        "Website privacy policy",
        "Purchase information",
        "Categories responsible for processing",
        "Privacy Area",
        "Appointment Request Information",
        "Gift Card Information",
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Policy", policySchema);
