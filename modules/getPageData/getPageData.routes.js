const express = require("express");
const { getHomePage, BlogPage, getPolicy, get_all_inclusive_TourPage, getAboutPage, country_wise, getfaq, contactPage  } = require("./getPageData.controllers");

const router = express.Router();

router.get("/home", getHomePage);
router.get("/all_inclusive_TourPage", get_all_inclusive_TourPage);
router.get("/country_wise/:id", country_wise);
router.get("/about", getAboutPage);
router.get("/about", getAboutPage);
router.get("/blogPage", BlogPage);
router.get("/policyPage", getPolicy);
router.get("/faqPage", getfaq);
router.get("/contactPage", contactPage);

module.exports = router;               
