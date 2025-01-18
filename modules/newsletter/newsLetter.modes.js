const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsLetterSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "email is required and unique"],
      unique: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("newsLetter", newsLetterSchema);
