import Product from "./product.model.js";

// Each controller function is responsible for handling a specific type of request related to products. 
// They interact with the Product model to perform database operations and send appropriate responses back to the client. 
// The functions are designed to handle errors gracefully by using try-catch blocks and passing any errors to the next middleware 
// (error handler) for centralized error handling.

// The `createProduct` function creates a new product in the database using the data provided in the request body.
// We create a new instance of the Product model using the data from `req.body`, which contains the product details sent by the client. 
// We then call `save()` on the product instance to save it to the database. If the save operation is successful, we send a 201 status code along with the created product in the response. 
// If any error occurs during this process (e.g., validation error), it will be caught in the catch block and passed to the next middleware (error handler) for proper handling.
const createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// The `getProducts` function retrieves a paginated list of products from the database. It calculates the page number, 
// limit, and skip values based on query parameters, and then uses these values to fetch the appropriate products and total count from 
// the database.
const getProducts = async (req, res, next) => {
    try {
        // Calculate pagination parameters: page, limit, and skip. We use `Math.max` and `Math.min` to ensure that the page number is 
        // at least 1 and the limit is between 1 and 50.
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

        // The `limit` variable determines how many products to return per page. We parse the `limit` query parameter and ensure it 
        // is between 1 and 50 to prevent excessive data retrieval.
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);

        // The `skip` variable calculates how many products to skip based on the current page and limit. This is used for pagination
        const skip = (page - 1) * limit;

        // We use `Promise.all` to execute both the `find` and `countDocuments` operations concurrently. The `find` operation retrieves the products 
        // for the current page, while the `countDocuments` operation gets the total number of products in the database. 
        // This allows us to return both the products and the total count in a single response, which is useful for pagination on the client side.
        const [items, total] = await Promise.all([
            Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(),
        ]);

        // Finally, we send a JSON response containing the current page, limit, total number of products, total pages (calculated by 
        // dividing total by limit), and the list of products for the current page.
        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (error) {
        next(error);
    }
};

// The `getProductById` function retrieves a single product from the database based on the ID provided in the request parameters.
// We use `Product.findById` to find the product with the specified ID. If the product is not found, we send a 404 status code with a 
// message indicating that the product was not found. 
// If the product is found, we return it in the response. Any errors that occur during this process are caught and passed to 
// the next middleware (error handler) for proper handling.
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(product);
    } catch (error) {
        return next(error);
    }
};

// The `updateProduct` function updates an existing product in the database based on the ID provided in the request parameters 
// and the new data provided in the request body.
// We use `Product.findByIdAndUpdate` to find the product by ID and update it with the new data from `req.body`. 
// The `new: true` option ensures that the updated product is returned in the response, while `runValidators: true` ensures that the new data is validated against the schema. 
// If the product is not found, we send a 404 status code with a message indicating that the product was not found. 
// If the update is successful, we return the updated product in the response. Any errors that occur during this process are caught and passed to 
// the next middleware (error handler) for proper handling.
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        return next(error);
    }
};

// The `deleteProduct` function deletes an existing product from the database based on the ID provided in the request parameters.
// We use `Product.findByIdAndDelete` to find the product by ID and delete it. If the product is not found, we send a 404 status code with a message indicating that the product was not found.
// If the deletion is successful, we return a message indicating that the product was deleted. Any errors that occur during this process are caught and passed to the next middleware (error handler) for proper handling.
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted" });
    } catch (error) {
        return next(error);
    }
};

export { createProduct, deleteProduct, getProductById, getProducts, updateProduct };
