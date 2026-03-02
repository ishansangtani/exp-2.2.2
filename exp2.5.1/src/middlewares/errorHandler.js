// This middleware function is designed to handle errors that occur in the application. 
// It checks the type of error and sends an appropriate response to the client. For validation errors, it extracts 
// the error messages and sends a 400 status code with details. For cast errors (e.g., invalid ID format), it sends a 
// 400 status code with a specific message. For any other errors, it logs the error to the console and sends a 500 status code 
// with a generic server error message. 
// This centralized error handling helps to maintain clean and consistent error responses throughout the application.

const errorHandler = (error, req, res, next) => {
    // Check for Mongoose validation errors
    // Validation errors occur when the data being saved to the database does not meet the defined schema requirements.
    if (error.name === "ValidationError") {
        const details = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: "Validation failed", details });
    }

    // Check for Mongoose cast errors (e.g., invalid ObjectId)
    // Cast errors occur when an invalid value is provided for a field that expects a specific type, such as an ObjectId.
    if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    // For any other errors, log the error and send a generic server error response
    console.error(error);
    return res.status(500).json({ message: "Server error" });
};

export default errorHandler;
