// create/ single order/ all order/ unpay user
const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  updateOrder,
} = require("./order.controllers");

const router = express.Router();

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.get("/user/:userId", getUserOrders);

router.put("/:id/status", updateOrderStatus);
router.put("/:id", updateOrder);

router.delete("/:id", cancelOrder);

module.exports = router;
