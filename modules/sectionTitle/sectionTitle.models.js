const mongoose = require("mongoose");
const { Schema } = mongoose;

const sectinTitle = new Schema(
  {
    title: { type: String },
    description: { type: String },
    name: {
        type: String,
        enum: ["landing1", "landing2", "landing3"],
      },
    pageName : {type : String, enum : ["landing", "about", "tours", "contact"]  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("sectinTitle", sectinTitle);
