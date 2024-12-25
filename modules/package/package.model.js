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
        name: {
          type: String,
        },
        text: {
          type: String,
        },
      },
    ],
    notIncludeItems: [
      {
        name: {
          type: String,
        },
        text: {
          type: String,
        },
      },
    ],
    bookedFlights: [
      {
        flightFrom: {
          type: String,
        },
        flightTo: {
          type: String,
        },
        departureTime: {
          type: String,
        },
        arrivalTime: {
          type: String,
        },
        breakTime: {
          type: String,
        },

        flightClass: { type: String },

        price: {
          type: Number,
          required: true,
        },
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
        enum: ["All inclusive", "Custom", "Budget", "Luxury"],
      },
    ],

    images: [
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
