const mongoose = require("mongoose");

// Define the schema for the Product model
const calendarSchema = new mongoose.Schema({
  postedBy: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
});

// Create and export the Product model
module.exports = mongoose.model("Calendar", calendarSchema);
