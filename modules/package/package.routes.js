const express = require("express");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("./package.controll");
const { upload } = require("../../middleware/Multer.config");

const router = express.Router();

router.post("/", upload.array("imageUrl"), createPackage);

router.get("/", getAllPackages);

router.get("/:id", getPackageById);

router.put("/:id", upload.array("imageUrl"), updatePackage);

router.delete("/:id", deletePackage);



module.exports = router;
