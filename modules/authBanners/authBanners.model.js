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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuthBanners", authBannersSchema);
