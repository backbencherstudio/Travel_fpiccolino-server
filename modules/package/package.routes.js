const express = require("express");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  searchPackages,
} = require("./package.controll");
const { upload } = require("../../middleware/Multer.config");

const router = express.Router();

router.post("/", upload.array("images"), createPackage);

 

router.get("/", getAllPackages);
router.get("/:id", getPackageById);

router.put("/:id", upload.array("images"), updatePackage);

router.delete("/:id", deletePackage);
router.get("/search", searchPackages);

module.exports = router;
