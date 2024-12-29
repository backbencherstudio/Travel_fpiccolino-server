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

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;
  
    try {
      const review = await Review.findById(reviewId);       
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }   
        review.comment = comment;


        review.rating = rating;
        await review.save();
        res.status(200).json({
            message: "Review updated successfully",
            review,
        });
    }   
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }                                           

   
  };

  exports.getReviewall = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name image country") // Populating userId to get name and image
            .populate("packageId", "packageName") // Optional: If you need package info, adjust as needed
            .lean(); // Converts Mongoose documents to plain JavaScript objects

        const formattedReviews = reviews.map((review) => ({
            _id: review._id,
            name: review.userId?.name || "Unknown User",
            image: review.userId?.image || "default-image-url.jpg", // Fallback in case image is missing
            country: review.userId?.country || "Unknown Country",
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        }));

       return res.status(200).json({
            reviews: formattedReviews,
        });
    } catch (error) {
       return res.status(500).json({
            message: error.message,
        });
    }
}   
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        // Find the review by ID
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
