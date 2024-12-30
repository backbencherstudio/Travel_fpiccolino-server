const User = require("../users/users.models");
const Order = require("../order/order.models");
const Review = require("./review.model");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
  const { userId, orderId } = req.params;
  const { comment, rating } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.status !== "completed") {
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getReviewall = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name image country") // Populating userId to get name and image
      .populate("packageId", "packageName images") // Optional: If you need package info, adjust as needed
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      name: review.userId?.name || "Unknown User",
      image: review.userId?.image || "default-image-url.jpg", // Fallback in case image is missing
      country: review.userId?.country || "Unknown Country",
      rating: review.rating,
      comment: review.comment,
      pakageImg: review.packageId?.images?.[0] || "Unknown Package",
      createdAt: review.createdAt,
    }));

    // Adding total reviews count
    const totalReviews = reviews.length;

    return res.status(200).json({
      reviews: formattedReviews,
      totalReviews, // Adding the total count here
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getReviewsByPackage = async (req, res) => {
  try {
    const { pakageID } = req.params;

    if (!pakageID) {
      return res.status(400).json({ error: "Package ID is required" });
    }

    // Find all reviews for the given package ID
    const reviews = await Review.find({ packageId: pakageID });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for the specified package ID" });
    }

    // Fetch user details for each review
    const reviewsWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findById(review.userId);

        if (!user) {
          return res
            .status(404)
            .json({
              message: `User not found for review with ID ${review._id}`,
            });
        }

        return {
          review,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userImg: user.image,
          },
        };
      })
    );

    return res.status(200).json(reviewsWithUserDetails);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: "An error occurred while fetching the reviews and user details",
      });
  }
};

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
