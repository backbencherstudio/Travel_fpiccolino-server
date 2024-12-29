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
    pessenger: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // cost per package, will be hidden for client side
    cost_per_package: {
      type: Number,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
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
        // cost per package, will be hidden for client side
        cost_per_package: {
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
        cost_per_package: Number,
      },
    ],
    category: [
      {
        type: String,
        enum: ["All inclusive", "Custom", "Budget", "Luxury"],
        default: "All inclusive",
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
