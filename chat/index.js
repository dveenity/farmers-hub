const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// connect to mongoose
mongoose.connect(
  "mongodb+srv://davidodion898:Lelemembers1@cluster0.kk8xaer.mongodb.net/"
);

const MessageModel = require("./Models/MessageModel");

// Define a default route handler for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello, World! This is the chat route.");
});

// Chat Server

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Socket.IO logic goes here
io.on("connection", async (socket) => {
  console.log("A user connected");

  try {
    // Retrieve previous messages from the database
    const messages = await MessageModel.find()
      .sort("-timestamp")
      .limit(10)
      .exec();

    // Send previous messages to the connected client
    socket.emit("previousMessages", messages.reverse());
  } catch (err) {
    console.error("Error retrieving messages:", err);
  }

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    // Create a new message object
    const newMessage = new MessageModel({
      content: data.content,
      sender: data.user,
    });

    try {
      // Save the message to the database
      await newMessage.save();
      // Broadcast the message to all connected clients
      io.emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8800, () => {
  console.log(`Chat is running on port 8800`);
});
