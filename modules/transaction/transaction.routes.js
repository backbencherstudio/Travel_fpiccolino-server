const express = require("express");
const {
  getAllTransaction,
  deleteTransaction,
  searchTransaction,
} = require("./transaction.controller");

const router = express.Router();

router.get("/", getAllTransaction);
router.delete("/:id", deleteTransaction);
router.get("/search", searchTransaction);

module.exports = router;
