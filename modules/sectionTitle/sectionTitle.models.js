const mongoose = require("mongoose");
const { Schema } = mongoose;

const sectinTitle = new Schema(
  {
    title: { type: String },
    description: { type: String },
    name: {
      type: String,
      enum: [
        "landing1",
        "landing2",
        "landing3",
        "landing4",
        "landing5",
        "landing6",
        "all_inclusive_tour1",
        "all_inclusive_tour2",
        "country_wise1",
        "country_wise2",
        "about1",
        "about2",
        "about3",
      ],
    },
    pageName: { type: String, enum: ["landing", "about", "tours", "contact"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sectinTitle", sectinTitle);
