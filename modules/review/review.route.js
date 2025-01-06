const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewall,
  getReviewsByPackage,
} = require("./review.controller");
const { verifyUser } = require("../../middleware/verifyUser");

const router = express.Router();

router.post("/createReview/:userId/:orderId", verifyUser, createReview);
router.patch("/updateReview/:userId/:reviewId", updateReview);
router.get("/getReviewall", getReviewall);
router.delete("/deleteReview/:userId/:reviewId", verifyUser, deleteReview);
router.get("/getReviewbyPakage/:pakageID", getReviewsByPackage);

module.exports = router;
