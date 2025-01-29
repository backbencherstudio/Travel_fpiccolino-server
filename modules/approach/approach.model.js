const mongoose = require("mongoose");

const approachSchema = new mongoose.Schema(
  {
    logos: [
      {
        logo: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Approach", approachSchema);
