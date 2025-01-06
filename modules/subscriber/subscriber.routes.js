const express = require("express");
const {
  createSubscriber,
  getAllSubscriber,
  deleteSubscriber,
} = require("./subscriber.controller");
const { verifyUser } = require("../../middleware/verifyUser");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
 

const router = express.Router();

router.get("/",  getAllSubscriber);
router.post("/",verifyUser, createSubscriber);
router.delete("/:id",verifyAdmin, deleteSubscriber);

module.exports = router;
