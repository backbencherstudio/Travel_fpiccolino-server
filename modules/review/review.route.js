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

router.post("/createReview/:userId/:packageId", createReview);
router.patch("/updateReview/:userId/:reviewId", updateReview);
router.get("/getReviewall", getReviewall);
router.delete("/deleteReview/:reviewId", deleteReview);
router.get("/getReviewbyPakage/:pakageID", getReviewsByPackage);

module.exports = router;
