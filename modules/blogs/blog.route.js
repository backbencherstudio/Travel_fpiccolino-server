const express = require("express");
const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  updateContentFields,
  updateSpecificFields,
  uploadsImage,
  deleteContentAtIndex,
  UpdateCategory,
  filterBlogsByCategory,
  getAllBlogsAndCategoryCount,
  getPopularBlogs,
  getBlogsGroupedByCategory,
  updateTexContent,
} = require("../blogs/blog.controller");
// const { authenticate } = require("../middlewares/authMiddleware");
// const { uploads } = require("../config/SingleMuler.config");
const { upload } = require("../../config/Multer.config");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const router = express.Router();

// Blog routes
router.post("/uploads", upload.array("images"), uploadsImage);
router.post("/createblog", createBlog);
router.get("/blogGet/:id", getBlogById);
router.patch("/updateHeroSection/:id", updateSpecificFields);
router.patch("/updateContent/:id/:contentID", updateContentFields);
router.patch("/updatecatagory/:id", UpdateCategory);
router.patch("/updateTexContent/:id", updateTexContent);
router.delete("/deleteContent/:id/:contentID", deleteContentAtIndex);
router.delete("/blogDelete/:id", deleteBlog);
router.get("/allblogs", getAllBlogs);
router.get("/categorywise", filterBlogsByCategory);
router.get("/categoryCount", getAllBlogsAndCategoryCount);
router.get("/popular", getPopularBlogs);
router.get("/all", getBlogsGroupedByCategory);

module.exports = router;
