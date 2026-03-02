// This middleware function is designed to handle requests to routes that are not defined in the application. 
// When a request is made to a route that does not exist, this function will be called, and it will send a JSON response 
// with a 404 status code and a message indicating that the route was not found. This helps to provide a clear response 
// to clients when they try to access an invalid endpoint in the API.
const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export default notFound;
