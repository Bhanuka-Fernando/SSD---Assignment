// Configurations/DB_Connection.js
const mongoose = require("mongoose");

let isConnected = false; // Variable to track the connection status

const connectToDatabase = async (isTestEnv = false) => {
  if (isTestEnv) {
    // Use MongoDB Memory Server for tests
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {  // Not connected
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    return mongoose.connection;
  }

  // Normal database connection for production or development
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
