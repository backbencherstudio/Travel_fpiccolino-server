const Order = require("./order.models");
const Package = require("./../package/package.model");
const User = require("../users/users.models");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePaymentFun = async (req, res) => {  
  const { paymentMethodId, amount } = req.body; 
  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, 
          currency: 'usd',
          payment_method: paymentMethodId,
          payment_method_types: ['card'],
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


const checkout = async (req, res) =>{
  try {
     req.session.userData = req.body
     res.status(200).json({message : "success"})    

  } catch (error) {
    res.status(500).json(error)    
  }
}

const accesCheckoutData = async (req, res) =>{
  try {
    let data =  req.session.userData  
    res.status(200).json(data)  
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteCheckoutData = async (req, res) =>{
  try {
     delete req.session.userData  
    res.status(200).json({message : "delete successFull"})  
  } catch (error) {
    res.status(500).json(error)
  }
}


const checkoutNewUserData = async (req, res) =>{
  try {
     req.session.userUpdateData = req.body
     res.status(200).json({message : "success"})    

  } catch (error) {
    res.status(500).json(error)    
  }
}

const accesCheckoutNewData = async (req, res) =>{
  try {
    let data =  req.session.userUpdateData  
    res.status(200).json(data)  
  } catch (error) {
    res.status(500).json(error)
  }
}


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
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const totalOrders = orders.length;
    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    );

    res.status(200).json({
      totalOrders,
      statusCounts, // { pending: X, confirmed: X, completed: X, cancelled: X }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  getUserStatus
};
