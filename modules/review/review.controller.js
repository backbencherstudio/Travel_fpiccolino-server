const User = require("../users/users.models");
const Order = require("../order/order.models");
const Review = require("./review.model");



exports.createReview = async (req, res) => {

    const { userId, orderId } = req.params;
    const { comment, rating } = req.body;
    
     const user = await User.findById(userId);

        if (!user ) {
          return res.status(404).json({ error: "User not found" });
        }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if(order.status !== "completed"){ 
        return res.status(400).json({ error: "Order is not  completed" }); 
    }
    try {
      const review = new Review({
        userId,
        orderId,
        packageId: order.packageId,
        comment,
        rating,
      });
  
      await review.save();
  
      res.status(201).json({
        message: "Review created successfully",
        review,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};