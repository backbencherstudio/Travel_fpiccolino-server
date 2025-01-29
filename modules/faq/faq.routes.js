const express = require("express");
const faqController = require("./faq.controll");
const router = express.Router();

// Route to upsert FAQs
router.post("/upsert", faqController.upsertFAQ);

// Route to get all FAQs
router.get("/", faqController.getAllFAQs);

module.exports = router;
