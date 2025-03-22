const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    tourName: {
      type: String,
      // required: true,
    },
    tourDescription: {
      type: String,
      // required: true,
    },
    tourDate: {
      type: Date,
      // required: true,
    },
    tourDuration: {
      nights: {
        type: Number,
        // required: true,
      },
      days: {
        type: Number,
        // required: true,
      },
    },
    pessenger: {
      type: Number,
      // required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    // country: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Country",
    //   // type: String,
    // },
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
        flightDate: {
          type: Date,
        },
        flightType: {
          type: String,
        },
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
        flightFrom2: {
          type: String,
        },
        flightTo2: {
          type: String,
        },
        departureTime2: {
          type: String,
        },
        arrivalTime2: {
          type: String,
        },
        duration1: {
          type: String,
        },
        duration2: {
          type: String,
        },
        price: {
          type: Number,
          // required: true,
        },
      },
    ],
    insurance: [
      {
        insuranceName: { type: String },
        description: { type: String },
        price: { type: String },
      },
    ],
    country: {
      type: String,
    },
    category: [
      {
        type: String,
      },
    ],
    destination: {
      type: String,
    },
    amount: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    hotelName: { type: String },
    hotelAbout: { type: String },
    hotelImages: [
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
