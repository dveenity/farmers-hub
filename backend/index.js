const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "https://agro-farmers-hub.vercel.app",
//       "https://farmers-hub-backend.vercel.app",
//       "http://localhost:5173",
//     ],
//     methods: ["POST", "GET"],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "*",
  })
);

//images store path
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// cloudinary configurations
const cloud_name = process.env.cloudinaryName;
const api_key = process.env.cloudinaryApiKey;
const api_secret = process.env.cloudinaryApiSecret;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const mongoUrl = process.env.mongodbLive;
mongoose.connect(mongoUrl);

// fetch models
const User = require("./Models/Users");
const Products = require("./Models/Products");
const Orders = require("./Models/Orders");
const Activity = require("./Models/Activity");
const Calendar = require("./Models/Calendar");
const requireAuth = require("./Models/requireAuth");
const Delivered = require("./Models/Delivered");
const MessageModel = require("./Models/MessageModel");

const secretKey = process.env.SECRET;
const port = process.env.port;

const createToken = (_id) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: "7d" });
};

// Define a default route handler for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello, World! This is the root route.");
});

// Chat Server
const chatPort = process.env.chatPort;
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

server.listen(chatPort, () => {
  console.log(`Chat is running on port ${chatPort}`);
});

// server sign up handle signUp
app.post("/register", async (req, res) => {
  const { name, username, password, email, role } = req.body;

  try {
    // Register a new user
    const user = await User.signup(name, username, email, password, role);

    // Create a token for the user
    const token = createToken(user._id);

    // Send the token as a response
    res.status(200).send(token);
  } catch (error) {
    // Handle registration errors

    res.status(400).send(error?.message);
  }
});

// server login handle
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

// after login and signup routes, apply middleware to protect main app routes
app.use("/home", requireAuth);
app.use("/update-profile", requireAuth);
app.use("/addProduct", requireAuth);
app.use("/addActivity", requireAuth);
app.use("/activitiesFetch", requireAuth);

// Server route for the home page
app.get("/home", async (req, res) => {
  try {
    const userId = req.userId;
    // Retrieve the user's role from the database using the decoded user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(403).send("User not found.");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// Server route for getting all users for chat feature
app.get("/allUsers", async (req, res) => {
  try {
    // Retrieve all user's role from the database
    const user = await User.find();

    if (!user) {
      return res.status(403).send("User not found.");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// Server route to update user profile and add address
app.put("/update-profile", async (req, res) => {
  try {
    const userId = req.userId;
    const { name, street, state, country, phone } = req.body;
    // Retrieve the user from the database using the decoded user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(403).send("User not found.");
    }
    // Update the user's name if provided
    if (name) {
      user.name = name;
    }

    // Update the address if provided
    if (street || state || country) {
      user.address = {
        street: street || user.address.street,
        state: state || user.address.state,
        country: country || user.address.country,
        phone: phone || user.address.phone,
      };
    }

    // Save the updated user to the database
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// Create multer storage for storing images
const storage = multer.diskStorage({
  // We won't use disk storage, as we'll upload directly to Cloudinary
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Add farmer new product to database
app.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    const userId = req.userId;
    const { productName, productDescription, productPrice } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Retrieve the user's role from the database using the decoded user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Create a new Product document
    const newProduct = new Products({
      username: user.name,
      name: productName,
      description: productDescription,
      price: productPrice,
      image: result.secure_url, // Use the URL provided by Cloudinary
      time: new Date(), // Set current time directly here
    });

    // Save the new product to the database
    await newProduct.save();

    // Delete the temporary file from the server
    fs.unlinkSync(req.file.path);

    res.status(201).send({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal server error.");
  }
});

// add farmer new activity to database
app.post("/addActivity", upload.single("image"), async (req, res) => {
  try {
    const userId = req.userId;
    const { activityName, activityDescription } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Retrieve the user's role from the database using the decoded user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Create a new activity document
    const newProduct = new Activity({
      username: user.name,
      name: activityName,
      description: activityDescription,
      image: result.secure_url, // Use the URL provided by Cloudinary
      time: new Date(), // Set current time directly here
    });

    // Save the new activity to the database
    await newProduct.save();

    // Delete the temporary file from the server
    fs.unlinkSync(req.file.path);

    res.status(201).send({ message: "Activity added successfully" });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).send("Internal server error.");
  }
});

//fetch products from database
app.post("/productsFetch", async (req, res) => {
  try {
    // Fetch products from the database
    const products = await Products.find().sort({
      time: -1,
    }); // Sort by time in descending order

    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal server error.");
  }
});

//fetch products from db based on params
app.get("/product/:product", async (req, res) => {
  try {
    const productId = req.params.product;
    const product = await Products.findById(productId).sort({
      time: -1,
    }); // Sort by time in descending order

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: "product not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

// delete product from db per admin request
app.delete("/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    // Use Mongoose to delete the product from the database
    await Products.findByIdAndDelete(productId);
    res.sendStatus(200); // Send a success status code
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete activity from db per admin request
app.delete("/activity/:activityId", async (req, res) => {
  try {
    const activityId = req.params.activityId;

    // Use Mongoose to delete the activity from the database
    await Activity.findByIdAndDelete(activityId);
    res.sendStatus(200); // Send a success status code
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for adding orders
app.post("/orders", async (req, res) => {
  try {
    // Extract order details from the request body
    const {
      username,
      productId,
      productName,
      productPrice,
      productImage,
      userAddress,
    } = req.body;

    // Ensure all required fields are present in the request body
    if (!username || !productId || !productName || !productPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new order instance
    const newOrder = new Orders({
      username,
      productId,
      productName,
      price: productPrice,
      time: new Date(),
      image: productImage,
      status: "Pending", // Default status is 'Pending'
      userDeliveryDetails: userAddress,
      notifications: [],
      // Include any other relevant order details
    });

    // Save the order to the database
    await newOrder.save();

    // Find the product owner
    const productOwner = await Products.findById(productId);

    // Check if product owner is found
    if (!productOwner) {
      return res.status(404).json({ error: "Product owner not found" });
    }

    // Push new notification to the notifications array
    newOrder.notifications.push({
      message: `Hi ${productOwner.username}! New order for your product: ${productName}`,
      ownerId: productOwner.username,
      status: "unread",
    });

    await newOrder.save();

    // Respond with the newly created order
    res.status(200).json(newOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for retrieving admin orders
app.get("/orders/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Retrieve orders for the specified user from the database
    const adminOrders = await Orders.find({
      "notifications.ownerId": adminId,
    }).sort({
      time: -1,
    }); // Sort by time in descending order

    res.status(200).json(adminOrders); // Respond with the user's order history
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update order status
app.put("/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const { status } = req.body;

    // Validate if status is provided
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Find the order by ID and update its status
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Return the updated order
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to move product from orders to delivered schema
app.put("/deliver-product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product in the Orders schema
    const product = await Orders.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found in orders.");
    }

    // Extract owner's name from notifications if available
    let ownerName = "";
    if (product.notifications && product.notifications.length > 0) {
      ownerName = product.notifications[0].ownerId;
    }

    // Create a new delivered product
    const deliveredProduct = new Delivered({
      username: product.username,
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      time: new Date(),
      image: product.image,
      status: "Delivered",
      productOwner: ownerName, // Use the retrieved owner's name
    });

    // Remove the product from the orders schema
    await Orders.findByIdAndDelete(productId);

    // Save the delivered product
    await deliveredProduct.save();

    res.status(200).send("Product delivered successfully.");
  } catch (error) {
    console.error("Error delivering product:", error);
    res.status(500).send("Internal server error.");
  }
});

// Endpoint to fetch admin delivered products
app.get("/delivered/:adminId", async (req, res) => {
  try {
    const userId = req.params.adminId;

    // Find delivered products associated with the user ID
    const deliveredProducts = await Delivered.find({
      productOwner: userId,
    }).sort({
      time: -1,
    }); // Sort by time in descending order;

    res.status(200).json(deliveredProducts);
  } catch (error) {
    console.error("Error fetching delivered products:", error);
    res.status(500).send("Internal server error.");
  }
});

// Endpoint to fetch user purchased products
app.get("/purchased/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find delivered products associated with the user ID
    const deliveredProducts = await Delivered.find({ username: userId }).sort({
      time: -1,
    }); // Sort by time in descending order;

    res.status(200).json(deliveredProducts);
  } catch (error) {
    console.error("Error fetching delivered products:", error);
    res.status(500).send("Internal server error.");
  }
});

// Endpoint for retrieving user order history
app.get("/ordersUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve orders for the specified user from the database
    const userOrders = await Orders.find({ username: userId }).sort({
      time: -1,
    }); // Sort by time in descending order

    res.status(200).json(userOrders); // Respond with the user's order history
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for canceling an order
app.delete("/order/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID and delete it from the database
    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (deletedOrder) {
      res.status(200).json({ message: "Order canceled successfully" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for updating order status (optional)
app.put("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.userId;
    const { status } = req.body;

    // Find the order by ID and update its status
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).json(updatedOrder); // Respond with the updated order
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetch activities from database
app.post("/activitiesFetch", async (req, res) => {
  try {
    // Fetch activity from the database
    const activity = await Activity.find().sort({
      time: -1,
    }); // Sort by time in descending order

    res.status(200).send(activity);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal server error");
  }
});

// Post calendar details to calendar schema DB
app.post("/productCalender", async (req, res) => {
  try {
    const { username, productName, startDate, endDate } = req.body;

    // Create a new calendar document
    const newCalendar = new Calendar({
      postedBy: username,
      productName,
      startDate,
      endDate,
    });

    // Save the new calendar document
    await newCalendar.save();

    // Send the newly created calendar document in the response
    res.status(201).json(newCalendar);
  } catch (error) {
    console.error("Error adding calendar details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch calendar data from the database
app.get("/calendar", async (req, res) => {
  try {
    // Fetch all calendar documents from the database
    const calendars = await Calendar.find();

    // Send the fetched calendar data in the response
    res.status(200).json(calendars);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete calendar data from the database by Id
app.delete("/deleteCalendar", async (req, res) => {
  try {
    const { calendarProductId } = req.body;
    // Fetch all calendar documents from the database
    const deletedCalendar = await Calendar.findByIdAndDelete(calendarProductId);

    // Send the fetched calendar data in the response
    res.status(200).json(deletedCalendar);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
