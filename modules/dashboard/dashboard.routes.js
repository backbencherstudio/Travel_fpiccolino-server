const express = require("express");
const controller = require("./dashboard.controller");

const router = express.Router();

router.get("/", controller.getAll);

module.exports = router;
