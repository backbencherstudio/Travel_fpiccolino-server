const express = require("express");
const {
  getAllHeaders,
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
} = require("./header.controlle");
const { upload } = require("../../middleware/Multer.config");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.get("/", getAllHeaders);
router.get("/:pageName", getHeader);
router.post("/", upload.single("heroImage"), verifyAdmin, createHeader);
router.put("/", upload.single("heroImage"), verifyAdmin, updateHeader);
router.delete("/:pageName", verifyAdmin, deleteHeader);

module.exports = router;
