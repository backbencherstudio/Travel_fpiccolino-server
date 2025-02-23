const mongoose = require("mongoose");

const shortsSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true, // Ensure URL is mandatory
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("shorts", shortsSchema);
