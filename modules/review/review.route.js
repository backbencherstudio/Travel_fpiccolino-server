const express = require("express");
const { createReview, updateReview , deleteReview} = require("./review.controller");

const router = express.Router();


 
router.post('/createReview/:userId/:orderId', createReview);
router.patch('/updateReview/:userId/:reviewId', updateReview);
router.delete('/deleteReview/:userId/:reviewId', deleteReview);







module.exports = router;
