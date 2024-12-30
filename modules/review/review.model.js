const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
    comment: {
      type: String,
    },
    rating : {
        type : Number,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("review", reviewSchema);
