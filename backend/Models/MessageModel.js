const mongoose = require("mongoose");

// Define message schema
const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
