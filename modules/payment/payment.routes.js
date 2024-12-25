const express = require("express");
const { makePayment, webhook } = require("./payment.controller");

const router = express.Router();

router.post("/stripe/pay", makePayment);
router.post("/stripe/webhook", webhook);

module.exports = router;
