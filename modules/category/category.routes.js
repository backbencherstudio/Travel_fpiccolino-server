const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("./category.controll");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", verifyAdmin, createCategory);

// router.get("/:id", getPackageById);

router.delete("/:id", verifyAdmin, deleteCategory);

module.exports = router;
