const express = require("express");
const { whyUsPost } = require("./whyUs.controll");
const { getWhyUs } = require("./whyUs.controll");
const router = express.Router();

router.post("/", whyUsPost);

router.get("/", getWhyUs);

module.exports = router;
