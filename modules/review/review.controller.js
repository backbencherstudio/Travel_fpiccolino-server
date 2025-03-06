const User = require("../users/users.models");
const Order = require("../order/order.models");
const Review = require("./review.model");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
  const { userId, packageId } = req.params;
  const { comment, rating } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const review = new Review({
      userId,
      packageId,
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
      pakageImg: review.packageId?.images[0] || "Unknown Package",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
    const totalReviews = reviews.length;
    return res.status(200).json({
      reviews: formattedReviews,
      totalReviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
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
        return {
          review,
          user: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email,
                userImg: user.image,
              }
            : null, // Handle missing user gracefully
        };
      })
    );

    // Filter out reviews where user details are missing if necessary
    const filteredReviews = reviewsWithUserDetails.filter(
      (item) => item.user !== null
    );

    if (filteredReviews.length === 0) {
      return res.status(404).json({
        message: "All reviews have missing user details",
      });
    }

    return res.status(200).json(filteredReviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the reviews and user details",
    });
  }
};
