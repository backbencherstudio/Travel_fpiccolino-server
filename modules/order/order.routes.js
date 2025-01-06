// create/ single order/ all order/ unpay user
const bodyParser = require("body-parser");
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
  getUserStatus,
  checkoutNewUserData,
  accesCheckoutNewData,
  getAllOrders,
  // handleWebhook,
} = require("./order.controllers");
const { verifyUser } = require("../../middleware/verifyUser");

const router = express.Router();

router.post("/", createOrder);

router.post("/stripePayment", stripePaymentFun);
// router.post("/webhook", bodyParser.raw({ type: 'application/json' }), handleWebhook )

// ==================================>>> created by ami ( checkout data )
router.post("/checkout", verifyUser, checkout);
router.get("/checkout", accesCheckoutData);
router.delete("/checkout", verifyUser, deleteCheckoutData);

// ==================================>>> created by ami  ( new checkout data )
router.post("/checkoutWithNewData", verifyUser, checkoutNewUserData);
router.get("/checkoutWithNewData", accesCheckoutNewData);

router.get("/:id", getOrderById);
router.get("/", getAllOrders);

router.get("/user/:userId", getUserOrders);

router.get("/user/:userId/status", getUserStatus);   

router.put("/:id/status", verifyUser, updateOrderStatus);

router.put("/:id", verifyUser, updateOrder);

router.delete("/:id", verifyUser, cancelOrder);

module.exports = router;
