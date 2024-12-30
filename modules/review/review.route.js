const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewall,
  getReviewsByPackage
} = require("./review.controller");

const router = express.Router();

router.post("/createReview/:userId/:orderId", createReview);
router.patch("/updateReview/:userId/:reviewId", updateReview);
router.get("/getReviewall", getReviewall);
router.delete("/deleteReview/:userId/:reviewId", deleteReview);
router.get('/getReviewbyPakage/:pakageID', getReviewsByPackage);



module.exports = router;
