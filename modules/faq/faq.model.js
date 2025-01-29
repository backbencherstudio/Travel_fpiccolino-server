const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Booking and Reservations",
        "Travel Experience and Itinerary",
        "Payment and Pricing",
        "Travel Insurance and Safety",
      ],
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FAQ", faqSchema);
