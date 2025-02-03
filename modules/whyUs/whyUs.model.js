const mongoose = require("mongoose");

const whyUsSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
    },
    sideImage: {
      type: String,
    },
    logos: [
      {
        logo: {
          type: String,
          required: true,
          default: "placeholder.jpg",
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

module.exports = mongoose.model("WhyUs", whyUsSchema);
