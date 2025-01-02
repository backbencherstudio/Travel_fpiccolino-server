const express = require("express");
const { getHomePage, BlogPage, getPolicy, get_all_inclusive_TourPage, getAboutPage, country_wise  } = require("./getPageData.controllers");

const router = express.Router();

router.get("/home", getHomePage);
router.get("/all_inclusive_TourPage", get_all_inclusive_TourPage);
router.get("/country_wise/:id", country_wise);
router.get("/about", getAboutPage);
router.get("/about", getAboutPage);
router.get("/BlogPage", BlogPage);
router.get("/policyPage", getPolicy)

module.exports = router;               
