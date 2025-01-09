const express = require("express");
const controller = require("./dashboard.controller");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.get("/", verifyAdmin, controller.getAll);
router.get("/getRadarData", verifyAdmin, controller.getRadarData);
router.get("/getRevenueData", verifyAdmin, controller.getOrderAndRevenueData);
router.get("/bookingData", verifyAdmin, controller.bookingData);
 

module.exports = router;
