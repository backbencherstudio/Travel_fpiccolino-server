const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    tourName: {
      type: String,
      required: true,
    },
    tourDescription: {
      type: String,
      required: true,
    },
    tourDate: {
      type: Date,
      required: true,
    },
    tourDuration: {
      nights: {
        type: Number,
        required: true,
      },
      days: {
        type: Number,
        required: true,
      },
    },
    includeItems: [
      {
        type: String,
      },
    ],
    notIncludeItems: [
      {
        type: String,
      },
    ],
    bookedFlights: [
      {
        flightNumber: String,
        departureTime: Date,
        arrivalTime: Date,
        breakTime: Number,
        flightClass: String,
        price: Number,
      },
    ],
    insurance: [
      {
        insuranceName: String,
        description: String,
        price: Number,
      },
    ],
    category: [
      {
        type: String,
        // enum: ["All inclusive", "Custom", "Budget", "Luxury"],
      },
    ],
    imageUrl: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);
