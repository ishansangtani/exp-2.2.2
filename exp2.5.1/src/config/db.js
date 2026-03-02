import mongoose from "mongoose";

// MongoDB connection URI, either from environment variable or default to local MongoDB instance
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/product_db";

// Function to connect to MongoDB using Mongoose
const connectDb = async () => {
    // We use a try-catch block to handle any potential errors that may occur during the connection process.
    try {
        // Attempt to connect to MongoDB using the provided URI. The `mongoose.connect()` function returns a promise, 
        // so we use `await` to wait for the connection to be established before proceeding. If the connection is successful, 
        // we log a success message to the console.
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        // If an error occurs during the connection process, we catch it and log an error message to the console.
        console.error("MongoDB connection error:", error.message);
    }
};

export default connectDb;
