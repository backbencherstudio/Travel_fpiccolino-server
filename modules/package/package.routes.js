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
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "images" }, { name: "hotelImages" }]),
  createPackage
);
router.get("/", getAllPackages);
router.get("/:id", getPackageById);

// router.put("/:id", upload.array("images"), updatePackage);

router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "hotelImages" }]),
  updatePackage
);
router.delete("/:id", verifyAdmin, deletePackage);
router.get("/search", searchPackages);

module.exports = router;
