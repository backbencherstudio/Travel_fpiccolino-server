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
  updateTexContent
} = require("../blogs/blog.controller");
// const { authenticate } = require("../middlewares/authMiddleware");
// const { uploads } = require("../config/SingleMuler.config");
const { upload } = require("../../config/Multer.config");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const router = express.Router();



// Blog routes
router.post('/uploads', verifyAdmin, upload.array("images"), uploadsImage);
router.post('/createblog', verifyAdmin, createBlog);
router.get('/blogGet/:id', getBlogById);
router.patch('/updateHeroSection/:id', verifyAdmin, updateSpecificFields);
router.patch('/updateContent/:id/:contentID', verifyAdmin, updateContentFields);
router.patch('/updatecatagory/:id', verifyAdmin, UpdateCategory);
router.patch('/updateTexContent/:id', verifyAdmin, updateTexContent);
router.delete('/deleteContent/:id/:contentID', verifyAdmin, deleteContentAtIndex);
router.delete('/blogDelete/:id', verifyAdmin, deleteBlog);
router.get('/allblogs', getAllBlogs);
router.get('/categorywise', filterBlogsByCategory);
router.get('/categoryCount', getAllBlogsAndCategoryCount);
router.get('/popular', getPopularBlogs);
router.get('/all', getBlogsGroupedByCategory);

module.exports = router;
