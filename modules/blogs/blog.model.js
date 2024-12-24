const mongoose = require("mongoose");

// Define the schema for the Blog
const blogSchema = new mongoose.Schema({
  category: { type: String },
  heroSection: [
    {
      headerImg: { type: String },
      header: { type: String },
      text: { type: String },
      mainHeading: { type: String },
      mainSubHeading: { type: String },
    },
  ],

  contentList: [
    {
      headings: [{ type: String, required: true }],
      image: { type: String, required: true }, // Storing the image URL or path
      paragraphs: [{ type: String, required: true }],
    },
  ],

  Populer: { type: Boolean, default: false },
  info: { type: String },
  tag: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
