const express = require("express");
const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  updateSpecificFields,
  uploadsImage,
} = require("./blogs.controllers.js");
const { authenticate } = require("../middlewares/authMiddleware.js");
const { uploads } = require("../../middleware/SingleMuler.config.js");
const { upload } = require("../../middleware/Multer.config.js");

const router = express.Router();

router.post('/uploads', upload.array("images"), uploadsImage);
router.post('/createblog', authenticate, upload.array('images'), createBlog);
router.get('/blogGet/:id', getBlogById);
router.put('/blog/:id', authenticate, updateBlog);
router.patch('/blogUpdate/:id', authenticate, updateSpecificFields);
router.delete('/blogDelete/:id', authenticate, deleteBlog);
router.get('/allblogs', authenticate, getAllBlogs);


module.exports = router;
