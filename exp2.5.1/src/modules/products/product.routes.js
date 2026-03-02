import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.controller.js";

// We create a new router instance using `express.Router()`, which allows us to define routes for our product-related endpoints. 
const router = express.Router();

// We then define routes for creating a product (POST /), retrieving all products (GET /), retrieving a product by ID (GET /:id), 
// updating a product by ID (PUT /:id), and deleting a product by ID (DELETE /:id). Each route is associated with the corresponding controller function that handles the logic for that route. 
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// Finally, we export the router to be used in our main application file (app.js) where it will be mounted on the /api/products path.
export default router;
