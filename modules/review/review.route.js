const express = require("express");
const { createReview, updateReview , deleteReview, getReviewall} = require("./review.controller");

const router = express.Router();



router.post('/createReview/:userId/:orderId', createReview);
router.patch('/updateReview/:userId/:reviewId', updateReview);
router.get('/getReviewall', getReviewall);
router.delete('/deleteReview/:userId/:reviewId', deleteReview);







module.exports = router;
