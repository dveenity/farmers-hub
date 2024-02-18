const mongoose = require("mongoose");

// Define the schema for the Product model
const chatSchema = new mongoose.Schema({
  members: {
    type: Array,
  },

  timestamps: true,
});

// Create and export the Product model
module.exports = mongoose.model("Chat", chatSchema);
