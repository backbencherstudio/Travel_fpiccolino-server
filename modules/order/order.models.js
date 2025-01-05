const mongoose = require("mongoose");
const { Schema } = mongoose;

const TravelerSchema = new Schema({
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  date: { type: Date },
  email: { type: String, required: true },
  phone: { type: String },
});

const FlightSchema = new Schema({
  arrivalTime: { type: String },
  breakTime: { type: String },
  departureTime: { type: String },
  flightClass: { type: String, default: "" },
  flightFrom: { type: String },
  flightTo: { type: String },
  price: { type: Number },
});

const InsuranceSchema = new Schema({
  insuranceName: { type: String },
  description: { type: String },
  price: { type: Number },
});

const TourDurationSchema = new Schema({
  nights: { type: Number, required: true },
  days: { type: Number, required: true },
});

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

    flight: {
      type: [FlightSchema, Boolean],
      default: false, 
    },

    insurance: {
      type: [InsuranceSchema, Boolean],
      default: false, 
    },

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
