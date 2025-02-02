const express = require("express");
const { updateAuthBanners, getAuthBanners } = require("./authBanners.controll");
const router = express.Router();

router.post("/", updateAuthBanners);
router.get("/", getAuthBanners);

module.exports = router;
