const mongoose = require("mongoose");
const { Schema } = mongoose;

const footerSchema = new Schema({
    companyName: String,
    description: String,
    quickLinks: [
      {
        name: String,
        url: String,
      }
    ],
    contactInfo: {
      phone: String,
      email: String,
    },
    copyright: String,
  });
  
  
  module.exports = mongoose.model("Footer", footerSchema);