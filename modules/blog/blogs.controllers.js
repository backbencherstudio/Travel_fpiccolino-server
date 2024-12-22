// import Images from "../models/Image.js";
const Blog = require("./blogs.models.js");

const uploadsImage = async (req, res) => {
  try {
    const files = req.files.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    //const savedFiles = await Images.insertMany(files);

    res.status(200).json({
      message: "Files uploaded successfully!",
      images: files,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading files", error: err });
  }
};

const createBlog = async (req, res) => {
  try {
    const { category, heroSection, contentList, Populer, info, tag } = req.body;
    const newBlog = new Blog({
      category,
      heroSection,
      contentList,
      Populer,
      info,
      tag,
    });

    await newBlog.save();
    return res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating the blog post",
      error: error.message,
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSpecificFields = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Updates only the provided fields
      { new: true, runValidators: true } // Options: return updated document and run validators
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs from the database
    res.status(200).json({ message: "Blogs retrieved successfully", blogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve blogs", error: error.message });
  }
};

module.exports = {
  uploadsImage,
  createBlog,
  getBlogById,
  updateBlog,
  updateSpecificFields,
  deleteBlog,
  getAllBlogs,
};
