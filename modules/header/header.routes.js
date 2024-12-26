const express = require("express");
const {
  getAllHeaders,
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
} = require("./header.controlle");
const { upload } = require("../../middleware/Multer.config");

const router = express.Router();

router.get("/", getAllHeaders);
router.get("/:pageName", getHeader);
router.post("/", upload.single("image"), createHeader);
router.put("/", upload.single("image"), updateHeader);
router.delete("/:pageName", deleteHeader);

module.exports = router;
