const Order = require("./order.models");
const Package = require("./../package/package.model");
const User = require("../users/users.models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripePaymentFun = async (req, res) => {
  const { paymentMethodId, amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      payment_method_types: ["card"],
      confirm: true,
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// const handleWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   try {
//       const event = stripe.webhooks.constructEvent(
//           req.body,
//           sig,
//           process.env.STRIPE_WEBHOOK_SECRET
//       );

//       switch (event.type) {
//           case 'invoice.payment_succeeded': {
//               const invoice = event.data.object;
//               const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });

//               if (user) {
//                   user.paymentStatus = 'paid';
//                   user.totalPaid += invoice.amount_paid / 100;
//                   user.expirationDate = new Date(invoice.lines.data[0].period.end * 1000);
//                   await user.save();
//               }
//               break;
//           }
//           case 'invoice.payment_failed': {
//               const invoice = event.data.object;
//               const user = await User.findOne({ stripeSubscriptionId: invoice.subscription });

//               if (user) {
//                   user.paymentStatus = 'failed';
//                   await user.save();
//               }
//               break;
//           }
//           default:
//               console.log(`Unhandled event type: ${event.type}`);
//       }

//       res.status(200).json({ received: true });
//   } catch (err) {
//       console.error(`Webhook Error: ${err.message}`);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };

// const stripePaymentFun = async (req, res) => {
//   const { paymentMethodId, amount } = req.body;
//   console.log("hit");

//   console.log(111, paymentMethodId, amount);

//   try {
//       const paymentIntent = await stripe.paymentIntents.create({
//           amount,
//           currency: 'usd',
//           payment_method: paymentMethodId,
//           confirm: true,
//       });
//       res.status(200).json({ success: true, paymentIntent });
//   } catch (err) {
//       res.status(400).json({ success: false, error: err.message });
//   }

//   };

// const createOrder = async (req, res) => {
//   try {
//     console.log(req.body);

//     const savedOrder = await Order.save(req.body);

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     throw error;
//   }
// };

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the order", error });
  }
};

// const getAllOrders = async (req, res) => {
//   try {
//     const searchQuery = req.query.search || "";
//     const { startDate, endDate } = req.query;

//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     const queryConditions = [];

//     let parsedSearchQuery = searchQuery;
//     let isNumberSearch = false;
//     if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
//       parsedSearchQuery = parseFloat(searchQuery);
//       isNumberSearch = true;
//     }

//     // Add search condition for numeric fields
//     if (searchQuery) {
//       if (isNumberSearch) {
//         queryConditions.push({
//           $or: [
//             { toureAmount: parsedSearchQuery },
//             { totalPackageAmount: parsedSearchQuery },
//             { person: parsedSearchQuery },
//           ],
//         });
//       } else {
//         queryConditions.push({
//           $or: [
//             {
//               toureAmount: { $regex: searchQuery, $options: "i" }, // Search as string for non-numeric values
//             },
//             { totalPackageAmount: { $regex: searchQuery, $options: "i" } }, // Search as string for non-numeric values
//           ],
//         });
//       }
//     }

//     // Add date filtering if start or end dates are provided
//     if (start) {
//       queryConditions.push({
//         createdAt: { $gte: start },
//       });
//     }

//     if (end) {
//       queryConditions.push({
//         createdAt: { $lte: end },
//       });
//     }

//     // Execute query with conditions
//     const Orders = queryConditions.length
//       ? await Order.find({ $and: queryConditions })
//       : await Order.find();

//     res.status(200).json({ message: "Orders retrieved successfully", Orders });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to retrieve Orders", error: error.message });
//   }
// };
const getAllOrders = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const queryConditions = [];

    let parsedSearchQuery = searchQuery;
    let isNumberSearch = false;
    if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
      parsedSearchQuery = parseFloat(searchQuery);
      isNumberSearch = true;
    }

    // Add search condition for numeric fields
    if (searchQuery) {
      if (isNumberSearch) {
        queryConditions.push({
          $or: [
            { toureAmount: parsedSearchQuery },
            { totalPackageAmount: parsedSearchQuery },
            { person: parsedSearchQuery },
          ],
        });
      } else {
        queryConditions.push({
          $or: [
            {
              toureAmount: { $regex: searchQuery, $options: "i" }, // Search as string for non-numeric values
            },
            { totalPackageAmount: { $regex: searchQuery, $options: "i" } }, // Search as string for non-numeric values
          ],
        });
      }
    }

    // Add date filtering if start or end dates are provided
    if (start) {
      queryConditions.push({
        createdAt: { $gte: start },
      });
    }

    if (end) {
      queryConditions.push({
        createdAt: { $lte: end },
      });
    }

    const getImageUrl = (imagePath) => {
      if (
        imagePath.startsWith("http") ||
        imagePath.startsWith(process.env.APP_URL)
      ) {
        return imagePath;
      }
      return `${process.env.APP_URL}${imagePath}`;
    };

    let Orders = queryConditions.length
      ? await Order.find({ $and: queryConditions })
          .populate("userId", "-password")
          .sort({ createdAt: -1 })
      : await Order.find()
          .populate("userId", "-password")
          .sort({ createdAt: -1 });

    Orders = Orders.map((order) => {
      if (order.userId && order.userId.image) {
        order.userId.image = getImageUrl(order.userId.image); // Only update if not already a full URL
      }
      return order;
    });
    res.status(200).json({ message: "Orders retrieved successfully", Orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve Orders", error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    req.session.userData = req.body;
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const accesCheckoutData = async (req, res) => {
  try {
    let data = req.session.userData;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCheckoutData = async (req, res) => {
  try {
    delete req.session.userData;
    res.status(200).json({ message: "delete successFull" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkoutNewUserData = async (req, res) => {
  try {
    req.session.userUpdateData = req.body;
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const accesCheckoutNewData = async (req, res) => {
  try {
    let data = req.session.userUpdateData;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
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

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;

    const order = await Order.findByIdAndUpdate(orderId, data, { new: true });
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

const getUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).populate("packageId");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    let totalTours = 0;
    let completedTours = [];
    let pendingTours = [];
    let ongoingTours = [];

    const currentDate = new Date();

    const getImageUrl = (imagePath) => {
      return `${process.env.APP_URL}${imagePath}`;
    };

    for (const order of orders) {
      const packageData = order.packageId;
      if (!packageData) continue;

      totalTours++;

      const startDate = new Date(packageData.tourDate);
      const nights = packageData.tourDuration?.nights || 0;
      const days = packageData.tourDuration?.days || 0;
      const durationInHours = nights * 12 + days * 12;
      const endDate = new Date(
        startDate.getTime() + durationInHours * 60 * 60 * 1000
      );

      const updatedPackageData = {
        ...packageData.toObject(),
        hotelImages: undefined,
        hotelAbout: undefined,
        hotelName: undefined,
        images: packageData.images?.map(getImageUrl),
      };

      const tourDetails = {
        orderId: order._id,
        travelers: order.travelers,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        packageData: updatedPackageData,
        status: "",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      if (currentDate < startDate) {
        tourDetails.status = "pending";
        pendingTours.push(tourDetails);
      } else if (currentDate > endDate) {
        tourDetails.status = "completed";
        completedTours.push(tourDetails);
      } else {
        tourDetails.status = "ongoing";
        ongoingTours.push(tourDetails);
      }
    }

    res.status(200).json({
      summary: {
        totalTours,
        completedToursCount: completedTours.length,
        pendingToursCount: pendingTours.length,
        ongoingToursCount: ongoingTours.length,
      },
      tours: {
        completedTours,
        pendingTours,
        ongoingTours,
      },
    });
  } catch (error) {
    console.error("Error in getUserStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  stripePaymentFun,
  // handleWebhook,
  checkoutNewUserData,
  accesCheckoutNewData,
  createOrder,
  checkout,
  accesCheckoutData,
  deleteCheckoutData,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  searchOrders,
  getAllOrders,
  getUserStatus,
};
