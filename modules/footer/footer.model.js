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
    paymentLogos: [
      {
        type: String,
      },
    ],
    socialLinks: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Footer", footerSchema);
