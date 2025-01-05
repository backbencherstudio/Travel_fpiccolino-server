// create/ single order/ all order/ unpay user
const bodyParser = require("body-parser")
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
  checkoutNewUserData,
  accesCheckoutNewData,
  // handleWebhook,
} = require("./order.controllers");

const router = express.Router();

router.post("/stripePayment", stripePaymentFun )
// router.post("/webhook", bodyParser.raw({ type: 'application/json' }), handleWebhook )


router.post("/", createOrder);

// ==================================>>> created by ami ( checkout data )
router.post("/checkout", checkout);
router.get("/checkout", accesCheckoutData);
router.delete("/checkout", deleteCheckoutData);

// ==================================>>> created by ami  ( new checkout data )
router.post("/checkoutWithNewData", checkoutNewUserData);
router.get("/checkoutWithNewData", accesCheckoutNewData);

router.get("/:id", getOrderById);

router.get("/user/:userId", getUserOrders);

router.put("/:id/status", updateOrderStatus);

router.put("/:id", updateOrder);

router.delete("/:id", cancelOrder);

module.exports = router;
