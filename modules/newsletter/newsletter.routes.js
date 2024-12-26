const express = require("express");
const { sendNewsletter } = require("./newsletter.controller");

const router = express.Router();

router.get("/send", sendNewsletter);

module.exports = router;