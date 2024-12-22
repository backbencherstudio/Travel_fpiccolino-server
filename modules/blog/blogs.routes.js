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
const { verifyUser } = require("../../middleware/verifyUser");
// const { uploads } = require("../../middleware/SingleMuler.config.js");
const { upload } = require("../../middleware/Multer.config.js");

const router = express.Router();

router.post('/uploads', upload.array("images"), uploadsImage);
router.post('/createblog', verifyUser, upload.array('images'), createBlog);
router.get('/blogGet/:id', getBlogById);
router.put('/blog/:id', verifyUser, updateBlog);
router.patch('/blogUpdate/:id', verifyUser, updateSpecificFields);
router.delete('/blogDelete/:id', verifyUser, deleteBlog);
router.get('/allblogs', verifyUser, getAllBlogs);


module.exports = router;