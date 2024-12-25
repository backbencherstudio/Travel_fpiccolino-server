const express = require("express");
const {
  getAllTransaction,
  deleteTransaction,
} = require("./transaction.controller");

const router = express.Router();

router.get("/", getAllTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
