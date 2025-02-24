const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contentTitle: {
      type: String,
    },
    contentDescription: {
      type: String,
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],

    image: {
      type: String,
    },
    isHome: {
      type: Boolean,
      default: false,
    },
    homeOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
