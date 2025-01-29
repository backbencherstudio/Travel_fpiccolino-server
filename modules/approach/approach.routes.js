const express = require("express");
const router = express.Router();
const { approachPost, getApproach } = require("./approach.controll");

// POST route to create/update approach data
router.post("/", approachPost);

// GET route to retrieve approach data
router.get("/", getApproach);

module.exports = router;
