const Order = require("./order.models");
const Package = require("./../package/package.model");
const User = require("../users/users.models");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      packageId,
      quantity,
      paymentMethod,
      notes,
      shippingAddress,
    } = req.body;

    const user = await User.findById(userId);
    const packageData = await Package.findById(packageId);
    if (!user || !packageData) {
      return res.status(404).json({ error: "User or Package not found" });
    }
    const totalPrice = Number(packageData.price) * quantity;

    const newOrder = new Order({
      userId,
      packageId,
      quantity,
      totalPrice,
      paymentMethod,
      notes,
      shippingAddress,
    });

    const savedOrder = await newOrder.save();

    // proceed to payment
    // const paymentResponse = await paymentHelper.makePayment({
    //   package_name: packageData.tourName,
    //   amount: totalPrice,
    //   order_id: savedOrder._id,
    // });

    res.status(201).json(savedOrder);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    throw error;
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("packageId", "tourName tourDescription");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .populate("packageId", "tourName price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "completed") {
      return res.status(400).json({ error: "Cannot cancel a completed order" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchOrders = async (req, res) => {
  try {
    const { q, status } = req.query;
    const query = {};
    if (q) {
      query.$text = { $search: q };
    }
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .populate("packageId", "tourName price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  // updateOrder,
  cancelOrder,
  searchOrders,
};
