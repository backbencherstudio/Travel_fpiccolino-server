const express = require("express");
const {
  createSubscriber,
  getAllSubscriber,
  deleteSubscriber,
} = require("../subscriber/subscriber.controller");

const router = express.Router();

router.get("/", getAllTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;