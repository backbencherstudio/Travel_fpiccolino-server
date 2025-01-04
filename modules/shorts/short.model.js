const mongoose = require("mongoose");

const shortsSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true, // Ensure URL is mandatory
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("shorts", shortsSchema);
