const mongoose = require("mongoose");

const authBannersSchema = new mongoose.Schema(
  {
    loginBanner: {
      type: String,
      default: "",
    },
    registerBanner: {
      type: String,
      default: "",
    },
    forgotBanner: {
      type: String,
      default: "",
    },
    otpBanner: {
      type: String,
      default: "",
    },
    homeBanner: {
      type: String,
      default: "",
    },
    tourBanner: {
      type: String,
      default: "",
    },
    aboutBanner: {
      type: String,
      default: "",
    },
    blogBanner: {
      type: String,
      default: "",
    },
    contactBanner: {
      type: String,
      default: "",
    },
    policyBanner: {
      type: String,
      default: "",
    },
    faqBanner: {
      type: String,
      default: "",
    },
    countryBanner: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuthBanners", authBannersSchema);
