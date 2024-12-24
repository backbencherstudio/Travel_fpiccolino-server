const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("./category.controll");

const router = express.Router();

router.post("/", createCategory);

router.get("/", getAllCategories);

// router.get("/:id", getPackageById);

router.delete("/:id", deleteCategory);

module.exports = router;
