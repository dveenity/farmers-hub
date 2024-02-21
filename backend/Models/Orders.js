const mongoose = require("mongoose");

// Define the schema for the Product model
const orderSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userDeliveryDetails: {
    type: Object,
    required: true,
  },
  notifications: [{ message: String, ownerId: String, status: String }], // Array of notifications
});

// Create and export the Product model
module.exports = mongoose.model("Order", orderSchema);
