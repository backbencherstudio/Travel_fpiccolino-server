// create/ single order/ all order/ unpay user

const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  updateOrder,
  searchOrders,
  checkout,
  accesCheckoutData,
  deleteCheckoutData,
  stripePaymentFun,
} = require("./order.controllers");

const router = express.Router();

router.post("stripePayment", stripePaymentFun )

router.post("/", createOrder);

router.post("/checkout", checkout);

router.get("/checkout", accesCheckoutData);
router.delete("/checkout", deleteCheckoutData);

router.get("/:id", getOrderById);

router.get("/user/:userId", getUserOrders);

router.put("/:id/status", updateOrderStatus);

router.put("/:id", updateOrder);

router.delete("/:id", cancelOrder);

module.exports = router;
