const express = require("express");
const { getHomePage, BlogPage  } = require("./getPageData.controllers");

const router = express.Router();

router.get("/home", getHomePage);
// router.get("/about", getAboutPage);
router.get("/BlogPage", BlogPage);

module.exports = router;
