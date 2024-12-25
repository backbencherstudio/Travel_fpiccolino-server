const express = require("express");
const {
  createSubscriber,
  getAllSubscriber,
  deleteSubscriber,
} = require("../subscriber/subscriber.controller");

const router = express.Router();

router.get("/", getAllSubscriber);
router.post("/", createSubscriber);
router.delete("/:id", deleteSubscriber);

module.exports = router;
