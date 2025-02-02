const express = require("express");
const policyController = require("./policy.controller");
const router = express.Router();

// Route to upsert policy
router.post("/upsert", policyController.upsertPolicy);

// Route to get all policies
router.get("/", policyController.getAllPolicies);

// Route to get policy by category
router.get("/:category", policyController.getPolicyByCategory);

module.exports = router;
