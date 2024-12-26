const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema(
  {
    blogDetailsTitle: {
      type: String,
      required: [true, "Blog Details Title is required"],
      trim: true,
    },
    heroImage: {
      type: String,
      // required: [true, "Hero Image File is required"],
    },
    titleOne: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    pageName: {
      type: String,
      required: [true, "Page Name is required"],
      enum: ["home", "tour", "about", "blog", "contact", "faq"],
    },
    descriptionOne: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Header", headerSchema);
