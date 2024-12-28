const express = require("express");
const { createReview } = require("./review.controller");

const router = express.Router();



router.post('/createReview/:userId/:orderId', createReview);







module.exports = router;
