const express = require("express");
const { makePayment, webhook } = require("./payment.controller");
const { verifyUser } = require("../../middleware/verifyUser");

const router = express.Router();

router.post("/stripe/pay", verifyUser, makePayment);
router.post("/stripe/webhook",verifyUser, webhook);

module.exports = router;
