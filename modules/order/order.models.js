const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for Traveler Details
const TravelerSchema = new Schema({
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  date: { type: Date },
  email: { type: String, required: true },
  phone: { type: String },
});

// Schema for Flight Details
const FlightSchema = new Schema({
  arrivalTime: { type: String },
  breakTime: { type: String },
  departureTime: { type: String },
  flightClass: { type: String, default: "" },
  flightFrom: { type: String },
  flightTo: { type: String },
  price: { type: Number },
});

// Schema for Insurance Details
const InsuranceSchema = new Schema({
  insuranceName: { type: String },
  description: { type: String },
  price: { type: Number },
});

// Schema for Tour Duration
const TourDurationSchema = new Schema({
  nights: { type: Number, required: true },
  days: { type: Number, required: true },
});

// Main Order Schema
const OrderSchema = new Schema(
  {
    packageId: {
      type: mongoose.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    totalPackageAmount: {
      type: Number,
      required: true,
    },
    toureAmount: {
      type: Number,
      required: true,
    },

    // Optional Flight Details (defaults to {})
    flight: {
      type: [FlightSchema, Boolean],
      default: false, // Set to false if no flight is included
    },

    // Optional Insurance Details (defaults to false)
    insurance: {
      type: [InsuranceSchema, Boolean],
      default: false, // Set to false if no insurance is included
    },

    // Optional flightPrice (defaults to false)
    flightPrice: {
      type: Number,
      default: false,
    },

    tourDate: {
      type: Date,
      required: true,
    },
    travelers: [TravelerSchema],
    person: {
      type: Number,
      required: true,
    },
    tourDuration: TourDurationSchema,
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
