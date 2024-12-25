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
      const dynamicPath = file.path.split("uploads\\")[1]; 
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
        const {  id, contentID } = req.params; // Expect blogId and contentListIndex in URL params

        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (contentID < 0 || contentID >= blog.contentList.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }

        blog.contentList.splice(contentID, 1);
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
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }
  
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


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: "Blogs retrieved successfully", blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
  }
};

exports.filterBlogsByCategory = async (req, res) => {
  try {
    const { category, page = 1 } = req.query;

    if (!category) {
      return res.status(400).json({
        message: "Category is required for filtering",
      });
    }
    const filter = { category };

    const limit = 20; 
    const skip = (page - 1) * limit; 

    // Fetch blogs with pagination
    const blogs = await Blog.find(filter).skip(skip).limit(limit);

    // Count total blogs matching the category filter for pagination metadata
    const totalBlogs = await Blog.countDocuments(filter);

    res.status(200).json({
      message: "Blogs filtered by category successfully",
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to filter blogs by category",
      error: error.message,
    });
  }
};

exports.getAllBlogsAndCategoryCount = async (req, res) => {
  try {
    // Fetch category-wise count
    const categoryCounts = await Blog.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Optional: Sort by count descending
    ]);

    // Format the response to match the desired format
    const categories = categoryCounts.map((item) => ({
      [item._id]: item.count,
    }));

    // Construct the response
    res.status(200).json({
      Categories: categories,
    });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category counts",
      error: error.message,
    });
  }
};

exports.getPopularBlogs = async (req, res) => {
  try {
    // Find all blogs where Populer is true
    const popularBlogs = await Blog.find({ Populer: true });

    // Check if there are any popular blogs
    if (popularBlogs.length === 0) {
      return res.status(404).json({ message: 'No popular blogs found' });
    }

    // Send the popular blogs in the response
    return res.status(200).json(popularBlogs);
  } catch (error) {
    console.error('Error fetching popular blogs:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.getBlogsGroupedByCategory = async (req, res) => {
  try {
    // Fetch all blogs from the database
    const blogs = await Blog.find().lean();

    // Group blogs by category
    const groupedBlogs = blogs.reduce((result, blog) => {
      const category = blog.category || "Uncategorized"; // Default category if none is provided
      const heroSection = blog.heroSection[0] || ""; // Extract blog name
      const blogDescription = blog.info || "No Description"; // Extract blog description
      const createdAt = blog.createdAt; // Extract creation date
      const tag = blog.tag || "No Tag"; // Extract tag or default
      id = blog._id;

      // Initialize the category array if it doesn't exist
      if (!result[category]) {
        result[category] = [];
      }

      // Add blog details to the category
      result[category].push({
        heroSection: heroSection,
        blog_description: blogDescription,
        created_at: createdAt,
        tag,
        id
      });

      return result;
    }, {});

    return res.status(200).json(groupedBlogs) ;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};


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
