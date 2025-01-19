const mongoose = require("mongoose");
const { Schema } = mongoose;

const footerSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    copyright: {
      type: String,
    },
    logoImg: {
      type: String,
    },
    bannerImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Footer", footerSchema);
