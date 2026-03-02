import mongoose from "mongoose";

// Define the schema for the Product model, which includes fields for name, price, category, and inStock status.
// Each field has specific validation rules to ensure that the data stored in the database is consistent and meets the required criteria.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [80, "Product name must be at most 80 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be at least 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Electronics", "Accessories", "Home", "Office", "Other"],
        message: "Category is not supported",
      },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add an instance method to the product schema that applies a discount to the product's price.
// Why do we use an instance method here? An instance method is used because it operates on a specific instance of the Product model. 
// This allows us to call the `applyDiscount` method on any product instance, and it will modify the price of that particular 
// product based on the provided discount percentage.
productSchema.methods.applyDiscount = function applyDiscount(percent) {
  const normalized = Math.max(0, Math.min(percent, 100));
  const discounted = this.price - (this.price * normalized) / 100;
  this.price = Math.round(discounted * 100) / 100;
  return this.price;
};

// What are .methods, .statics, and .virtuals in Mongoose?
// - .methods: This is used to define instance methods that can be called on individual documents (instances of the model). 
//   For example, `product.applyDiscount(10)` would call the `applyDiscount` method on a specific product document.
// - .statics: This is used to define static methods that can be called on the model itself, rather than on individual documents. 
//   For example, `Product.findByCategory("Electronics")` could be a static method that retrieves all products in the "Electronics" category.
// - .virtuals: This is used to define virtual properties that are not stored in the database but can be computed based on other fields. 
//   For example, you could define a virtual property `priceWithTax` that calculates the price including tax based on the `price` field.


// Create the Product model using the defined schema. The model provides an interface for interacting with the products 
// collection in the MongoDB database, allowing us to create, read, update, and delete product documents.
const Product = mongoose.model("Product", productSchema);

export default Product;

