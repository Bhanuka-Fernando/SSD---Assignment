const mongoose = require("mongoose");

let isConnected = false; // Variable to track the connection status

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Database is already connected.");
    return mongoose.connection; // Return the existing connection
  }

  try {
    // Establish a new connection
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true; // Mark the connection as established
    console.log("Database Connected");
    return mongoose.connection;
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err; // Re-throw error if the connection fails
  }
};

module.exports = { connectToDatabase };
