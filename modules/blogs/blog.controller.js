const Blog = require("../blogs/blog.model");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
// const { updateImage } = require("./DinamicImageController");

// Setup __filename and __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Upload images
exports.uploadsImage = async (req, res) => {
  try {
    const files = req.files.map((file) => {
      const dynamicPath = file.path.split("uploads\\")[1]; // Extract dynamic part after "uploads\\"
      return {
        filename: file.originalname,
        path: dynamicPath,
      };
    });

    res.status(200).json({
      message: "Files uploaded successfully!",
      images: files,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading files", error: err });
  }
};

// Create a blog
exports.createBlog = async (req, res) => {
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

// Get a blog by ID
exports.getBlogById = async (req, res) => {
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
exports.updateBlog = async (req, res) => {
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

// Update specific fields in a blog
exports.updateSpecificFields = async (req, res) => {
  try {
    const { oldImage, UpdatedImage, text, mainHeading, mainSubHeading, header } = req.body;
    const mainImage = UpdatedImage || oldImage;

    const updatedData = {
      headerImg: mainImage,
      header,
      text,
      mainHeading,
      mainSubHeading,
    };

    if (UpdatedImage && oldImage) {
      deleteImage(oldImage);
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: { heroSection: updatedData },
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update content fields in a blog
exports.updateContentFields = async (req, res) => {
  const { id, contentID } = req.params;
  const { UpdatedImage, oldImage, headings, paragraphs } = req.body;
  const mainImage = UpdatedImage || oldImage;

  if (UpdatedImage && oldImage) {
    deleteImage(oldImage);
  }

  const modifyObject = {
    headings,
    paragraphs,
    image: mainImage,
  };

  try {
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.contentList[contentID] = modifyObject;
    await blog.save();

    res.status(200).json({ message: "Content list object updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteContentAtIndex = async (req, res) => {
    try {
        const {  id, contentID } = req.params;  

        // Find the blog by its ID
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if contentListIndex is valid
        if (contentID < 0 || contentID >= blog.contentList.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }

        // Remove the item at the given index from contentList
        blog.contentList.splice(contentID, 1);

        // Save the updated blog object
        await blog.save();

        return res.status(200).json({ message: 'Content deleted successfully', blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error });
    }
};

exports.UpdateCategory = async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
  
    try {
      // Validate input
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }
  
      // Update the blog's category
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: id }, 
        { category },
        { new: true } 
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      res.status(200).json(updatedBlog);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: error.message });
    }
  };

// Delete a blog
exports.deleteBlog = async (req, res) => {
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

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: "Blogs retrieved successfully", blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
  }
};

// Delete an image
function deleteImage(imagePath) {
  const uploadsFolder = path.resolve(__dirname, "..", "..", "uploads");
  const filePath = path.join(uploadsFolder, imagePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err);
      return;
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
        return;
      }
      console.log("File deleted successfully");
    });
  });
}
