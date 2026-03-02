# Product CRUD Operations with Mongoose

A RESTful API for managing products using Node.js, Express.js, and MongoDB with Mongoose ODM. This project demonstrates CRUD operations, schema validation, pagination, and modular architecture patterns.

## 🎯 Objectives

- ✅ Define Mongoose schema and model with validation
- ✅ Implement create, read, update, delete operations
- ✅ Add comprehensive validation for product data
- ✅ Test operations with API endpoints
- ✅ Implement pagination for list endpoints
- ✅ Use modular architecture for scalability

## 📋 Prerequisites

### Hardware Requirements
- Processor: Intel i5 or equivalent
- RAM: 8GB minimum
- Storage: 500MB free space

### Software Requirements
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB 6.0+ ([Download](https://www.mongodb.com/try/download/community))
- Postman or any REST client ([Download](https://www.postman.com/downloads/))
- Git (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/amansekhon888/mongoose_product_database.git
cd mongoose_product_database
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Get mongodb connection string

### 4. Configure Environment (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/product_db
```

### 5. Run the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
node index.js
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
mongoose_product_database/
├── index.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── src/
│   ├── app.js              # Express app configuration
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── middlewares/
│   │   ├── errorHandler.js # Global error handler
│   │   └── notFound.js     # 404 handler
│   └── modules/
│       └── products/
│           ├── product.model.js      # Product schema & model
│           ├── product.controller.js # Business logic
│           └── product.routes.js     # Route definitions
├── README.md               # This file
├── ARCHITECTURE.md         # Architecture documentation
├── PACKAGES.md            # Package documentation
└── VULNERABILITIES.md     # Security considerations
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Get API Info
```http
GET /
```

**Response:**
```json
{
  "message": "Product API is running",
  "endpoints": [
    "POST /api/products",
    "GET /api/products",
    "GET /api/products/:id",
    "PUT /api/products/:id",
    "DELETE /api/products/:id"
  ]
}
```

### 2. Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true
}
```

**Response (201 Created):**
```json
{
  "_id": "65f4a8b7c1e6a8c1f4b8c7d1",
  "name": "Wireless Mouse",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z",
  "__v": 0
}
```

### 3. Get All Products (with Pagination)
```http
GET /api/products?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page (1-50), default: 10

**Response (200 OK):**
```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "items": [
    {
      "_id": "65f4a8b7c1e6a8c1f4b8c7d1",
      "name": "Wireless Mouse",
      "price": 29.99,
      "category": "Electronics",
      "inStock": true,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

### 4. Get Product by ID
```http
GET /api/products/:id
```

**Response (200 OK):**
```json
{
  "_id": "65f4a8b7c1e6a8c1f4b8c7d1",
  "name": "Wireless Mouse",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z",
  "__v": 0
}
```

### 5. Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "price": 24.99,
  "inStock": false
}
```

**Response (200 OK):**
```json
{
  "_id": "65f4a8b7c1e6a8c1f4b8c7d1",
  "name": "Wireless Mouse",
  "price": 24.99,
  "category": "Electronics",
  "inStock": false,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:45:00.000Z",
  "__v": 0
}
```

### 6. Delete Product
```http
DELETE /api/products/:id
```

**Response (200 OK):**
```json
{
  "message": "Product deleted"
}
```

## 🔐 Validation Rules

### Product Schema
- **name**: Required, 2-80 characters, trimmed
- **price**: Required, minimum 0
- **category**: Required, must be one of: `Electronics`, `Accessories`, `Home`, `Office`, `Other`
- **inStock**: Boolean, default: true

### Error Responses

**Validation Error (400):**
```json
{
  "message": "Validation failed",
  "details": [
    "Product name is required",
    "Price must be at least 0"
  ]
}
```

**Not Found (404):**
```json
{
  "message": "Product not found"
}
```

**Invalid ID Format (400):**
```json
{
  "message": "Invalid ID format"
}
```

**Server Error (500):**
```json
{
  "message": "Server error"
}
```

## 🧪 Testing

### Manual Testing with Postman
1. Import the API endpoints into Postman
2. Test each CRUD operation
3. Verify validation errors
4. Test pagination parameters

### Sample Test Data
```json
[
  {
    "name": "Wireless Mouse",
    "price": 29.99,
    "category": "Electronics",
    "inStock": true
  },
  {
    "name": "USB-C Cable",
    "price": 12.99,
    "category": "Accessories",
    "inStock": true
  },
  {
    "name": "Desk Lamp",
    "price": 45.00,
    "category": "Office",
    "inStock": false
  }
]
```

## 🎓 Viva Voce Questions & Answers

### 1. What's the purpose of Mongoose middleware?
Mongoose middleware (also called pre and post hooks) are functions that execute at specific stages during the execution of asynchronous functions. They're used for:
- Pre-save validation and data transformation
- Post-save logging and notifications
- Pre-remove cleanup operations
- Query modifications and logging

### 2. How does schema validation differ from application validation?
- **Schema Validation**: Enforced at the database/ODM level (Mongoose), ensures data integrity, cannot be bypassed
- **Application Validation**: Enforced in business logic, more flexible, can include complex rules and external API calls
- Schema validation is the last line of defense, while application validation provides better UX

### 3. When should you use findByIdAndUpdate vs save()?
- **findByIdAndUpdate**: Atomic operation, faster, but doesn't trigger save middleware or some validators by default. Use for simple updates.
- **save()**: Triggers all middleware, full validation, better for complex updates with business logic. Use when you need complete lifecycle hooks.

### 4. How would you implement pagination?
Use `skip()` and `limit()` with MongoDB:
```javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;
const products = await Product.find().skip(skip).limit(limit);
const total = await Product.countDocuments();
```

### 5. What are Mongoose virtuals and when to use them?
Virtuals are document properties that don't get persisted to MongoDB. They're computed on-the-fly:
```javascript
productSchema.virtual('priceWithTax').get(function() {
  return this.price * 1.1;
});
```
Use them for: derived values, full names from first/last, formatted dates, etc.
Visit product.model.js file to learn more about virtuals, methods, and statics.

## 🛠️ Additional Features

### Custom Instance Methods
The Product model includes a custom instance method for applying discounts:

```javascript
const product = await Product.findById(id);
product.applyDiscount(10); // Apply 10% discount
await product.save();
```

## 📚 Learning Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [REST API Best Practices](https://restfulapi.net/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

ISC

## 👨‍💻 Author

Aman Sekhon ([@amansekhon888](https://github.com/amansekhon888))

## 🙏 Acknowledgments

This project was created as part of a Full Stack Development course to demonstrate proficiency in Node.js, Express.js, MongoDB, and RESTful API design.
