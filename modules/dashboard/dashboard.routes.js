const express = require("express");
const controller = require("./dashboard.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/getRadarData", controller.getRadarData);
router.get("/getRevenueData", controller.getRevenueData);


module.exports = router;
