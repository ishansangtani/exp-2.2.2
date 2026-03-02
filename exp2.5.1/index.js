import app from "./src/app.js";
import connectDb from "./src/config/db.js";

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server after connecting to the database
const startServer = async () => {
    // Why await - We want to ensure that the database connection is established before the server starts accepting requests. 
    // If we start the server before connecting to the database, we might run into issues where the server is running but 
    // cannot access the database, leading to errors when handling requests that require database access. 
    // By using await, we ensure that the server only starts after a successful connection to the database has been made.
    await connectDb();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();