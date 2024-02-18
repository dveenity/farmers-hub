const mongoose = require("mongoose");

// Define the schema for the Product model
const deliveredSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  productOwner: {
    type: String,
    required: true,
  },
});

// Create and export the Product model
module.exports = mongoose.model("Delivered", deliveredSchema);
