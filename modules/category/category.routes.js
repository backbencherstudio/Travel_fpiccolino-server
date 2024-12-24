const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("./category.controll");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);

// router.get("/:id", getPackageById);

router.delete("/:id", deleteCategory);

module.exports = router;
