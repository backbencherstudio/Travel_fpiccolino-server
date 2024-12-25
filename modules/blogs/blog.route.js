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
  UpdateCategory
} = require("../blogs/blog.controller");
// const { authenticate } = require("../middlewares/authMiddleware");
// const { uploads } = require("../config/SingleMuler.config");
const { upload } = require("../../config/Multer.config");
const router = express.Router();

/**
 * Swagger documentation remains unchanged.
 */

// Blog routes
router.post('/uploads', upload.array("images"), uploadsImage);
router.post('/createblog', createBlog);
router.get('/blogGet/:id', getBlogById);
router.patch('/updateHeroSection/:id', updateSpecificFields);
router.patch('/updateContent/:id/:contentID', updateContentFields);
router.patch('/updatecatagory/:id', UpdateCategory);
router.delete('/deleteContent/:id/:contentID', deleteContentAtIndex);
router.delete('/blogDelete/:id', deleteBlog);
router.get('/allblogs', getAllBlogs);

module.exports = router;
