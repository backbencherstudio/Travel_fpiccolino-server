const express = require("express");
const { getHomePage, BlogPage, getPolicy  } = require("./getPageData.controllers");

const router = express.Router();

router.get("/home", getHomePage);
// router.get("/about", getAboutPage);
router.get("/BlogPage", BlogPage);
router.get("/policyPage", getPolicy)

module.exports = router;
