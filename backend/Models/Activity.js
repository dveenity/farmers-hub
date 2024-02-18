const mongoose = require("mongoose");

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// Create and export the Product model
module.exports = mongoose.model("Activity", productSchema);
