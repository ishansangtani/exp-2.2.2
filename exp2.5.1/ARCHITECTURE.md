# Architecture Documentation

## Overview

This project follows a **modular, layered architecture** pattern that separates concerns and promotes maintainability, scalability, and testability. The architecture is designed for a RESTful API using Node.js, Express.js, and MongoDB with Mongoose ODM.

## Architectural Principles

### 1. Separation of Concerns
Each module has a single responsibility:
- **Models**: Data structure and business logic
- **Controllers**: Request handling and response formatting
- **Routes**: Endpoint definition and middleware binding
- **Config**: Application configuration
- **Middlewares**: Cross-cutting concerns (error handling, logging, etc.)

### 2. Layered Architecture
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│     (Routes & Controllers)          │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│     (Controllers & Services)        │
├─────────────────────────────────────┤
│         Data Access Layer           │
│         (Models & ODM)              │
├─────────────────────────────────────┤
│         Database Layer              │
│           (MongoDB)                 │
└─────────────────────────────────────┘
```

### 3. Modular Structure
Each feature is organized into self-contained modules with their own models, controllers, and routes.

## Directory Structure

```
mongoose_product_database/
│
├── index.js                          # Application entry point
│   └── Initializes Express app and starts server
│
├── package.json                      # Dependencies and NPM scripts
│
└── src/                              # Source code root
    │
    ├── app.js                        # Express app configuration
    │   ├── Import dependencies
    │   ├── Initialize database connection
    │   ├── Configure middleware
    │   ├── Register routes
    │   └── Register error handlers
    │
    ├── config/                       # Configuration files
    │   └── db.js                     # Database connection setup
    │       ├── MongoDB URI configuration
    │       ├── Connection options
    │       └── Error handling
    │
    ├── middlewares/                  # Reusable middleware functions
    │   ├── errorHandler.js          # Global error handler
    │   │   ├── ValidationError handling
    │   │   ├── CastError handling
    │   │   └── Generic error handling
    │   │
    │   └── notFound.js              # 404 handler for undefined routes
    │
    └── modules/                      # Feature modules
        └── products/                 # Product module
            ├── product.model.js      # Mongoose schema and model
            │   ├── Schema definition with validation
            │   ├── Instance methods
            │   ├── Static methods
            │   └── Middleware hooks
            │
            ├── product.controller.js # Request handlers
            │   ├── createProduct()
            │   ├── getProducts() with pagination
            │   ├── getProductById()
            │   ├── updateProduct()
            │   └── deleteProduct()
            │
            └── product.routes.js     # Route definitions
                ├── POST /
                ├── GET /
                ├── GET /:id
                ├── PUT /:id
                └── DELETE /:id
```

## Component Details

### 1. Entry Point (`index.js`)

**Purpose**: Bootstrap the application

**Responsibilities**:
- Import the configured Express app
- Define the server port
- Start the HTTP server
- Log server status

**Flow**:
```javascript
Import app → Set PORT → Listen on PORT → Log success
```

### 2. App Configuration (`src/app.js`)

**Purpose**: Configure Express application and wire dependencies

**Responsibilities**:
- Initialize Express
- Connect to database
- Configure middleware (JSON parsing)
- Register module routes
- Register error handlers

**Middleware Stack Order**:
1. Built-in middleware (`express.json()`)
2. Custom middleware (if any)
3. Route handlers
4. 404 handler
5. Error handler

**Design Pattern**: Dependency Injection
```javascript
import productRoutes from "./modules/products/product.routes.js";
app.use("/api/products", productRoutes);
```

### 3. Database Configuration (`src/config/db.js`)

**Purpose**: Centralize database connection logic

**Responsibilities**:
- Read connection string from environment or use default
- Establish MongoDB connection
- Handle connection errors
- Export connection function

**Design Pattern**: Singleton
- Single database connection shared across the application

**Error Handling**:
- Logs connection errors
- Allows application to continue (fail gracefully)

### 4. Middlewares (`src/middlewares/`)

#### 4.1 Error Handler (`errorHandler.js`)

**Purpose**: Centralized error handling

**Responsibilities**:
- Catch ValidationError and return 400
- Catch CastError (invalid ObjectId) and return 400
- Log unexpected errors
- Return 500 for unknown errors

**Design Pattern**: Error Handling Middleware (Express convention)

**Error Flow**:
```
Controller throws error
    ↓
Express catches error
    ↓
Passes to error handler (next(error))
    ↓
Error handler categorizes error
    ↓
Returns appropriate HTTP response
```

#### 4.2 Not Found Handler (`notFound.js`)

**Purpose**: Handle requests to undefined routes

**Responsibilities**:
- Catch all unmatched routes
- Return 404 with message

**Placement**: Registered after all valid routes

### 5. Product Module (`src/modules/products/`)

#### 5.1 Model (`product.model.js`)

**Purpose**: Define data structure and validation

**Responsibilities**:
- Define Mongoose schema
- Add validation rules
- Define instance methods
- Export compiled model

**Schema Features**:
- **Field Validation**: Required, min/max, enum
- **Timestamps**: Automatic createdAt/updatedAt
- **Instance Methods**: Custom business logic (e.g., `applyDiscount()`)

**Design Patterns**:
- Active Record (Mongoose models)
- Domain Model (business logic in model)

#### 5.2 Controller (`product.controller.js`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Parse request data
- Call model methods
- Format responses
- Pass errors to error handler

**Controller Functions**:
1. **createProduct**: Validate and save new product
2. **getProducts**: Fetch paginated product list
3. **getProductById**: Fetch single product
4. **updateProduct**: Update existing product
5. **deleteProduct**: Remove product

**Design Pattern**: Controller (MVC)

**Error Handling Strategy**:
- Use try-catch blocks
- Pass errors to Express error handler via `next(error)`
- Let error handler middleware format error responses

#### 5.3 Routes (`product.routes.js`)

**Purpose**: Map HTTP methods and paths to controllers

**Responsibilities**:
- Define route paths
- Bind HTTP methods
- Connect routes to controllers
- Export router

**Design Pattern**: Router (Express Router)

**Route Definitions**:
```
POST   /          → createProduct
GET    /          → getProducts (with pagination)
GET    /:id       → getProductById
PUT    /:id       → updateProduct
DELETE /:id       → deleteProduct
```

## Data Flow

### Create Product Flow
```
1. Client sends POST request with JSON body
        ↓
2. Express parses JSON (express.json())
        ↓
3. Route matches POST /api/products
        ↓
4. Controller: createProduct()
        ↓
5. Create new Product instance
        ↓
6. Validate against schema
        ↓
7. Save to MongoDB
        ↓
8. Return created product (201)
```

### Get Products Flow (with Pagination)
```
1. Client sends GET request with query params (?page=1&limit=10)
        ↓
2. Route matches GET /api/products
        ↓
3. Controller: getProducts()
        ↓
4. Parse pagination params (page, limit)
        ↓
5. Calculate skip value
        ↓
6. Execute two parallel queries:
   - Product.find().skip().limit()
   - Product.countDocuments()
        ↓
7. Format response with metadata
        ↓
8. Return paginated result (200)
```

### Update Product Flow
```
1. Client sends PUT request with ID and JSON body
        ↓
2. Route matches PUT /api/products/:id
        ↓
3. Controller: updateProduct()
        ↓
4. Call findByIdAndUpdate() with validation
        ↓
5. MongoDB updates document
        ↓
6. Return updated product (200) or 404
```

### Error Flow
```
1. Error occurs in controller
        ↓
2. Controller calls next(error)
        ↓
3. Express skips to error handler
        ↓
4. Error handler checks error type
        ↓
5. Format and return appropriate response
```

## Design Patterns Used

### 1. MVC (Model-View-Controller)
- **Model**: `product.model.js` (data + validation)
- **View**: JSON responses (no template engine)
- **Controller**: `product.controller.js` (request handling)

### 2. Router Pattern
- Express Router for modular route definitions
- Each module has its own router

### 3. Middleware Chain
- Sequential execution of middleware functions
- Separation of concerns (parsing, auth, error handling)

### 4. Repository Pattern (Implicit)
- Mongoose models act as repositories
- Abstract data access logic

### 5. Dependency Injection
- Modules import dependencies explicitly
- Easy to test and replace dependencies

## Scalability Considerations

### Adding New Modules
```
1. Create new folder in src/modules/:
   - module.model.js
   - module.controller.js
   - module.routes.js

2. Import routes in src/app.js:
   import moduleRoutes from "./modules/moduleName/module.routes.js";
   app.use("/api/moduleName", moduleRoutes);

3. Done!
```

### Adding Middleware
```
1. Create middleware function in src/middlewares/

2. Import in src/app.js:
   import middleware from "./middlewares/middleware.js";
   app.use(middleware);

3. Done!
```

### Adding Services
For complex business logic, create a service layer:
```
src/modules/products/
  ├── product.model.js
  ├── product.service.js    ← New service layer
  ├── product.controller.js
  └── product.routes.js
```

## Security Architecture

### Input Validation
- Schema-level validation (Mongoose)
- Required fields, data types, ranges
- Enum constraints for categories

### Error Information Disclosure
- Generic error messages for production
- Detailed logs for debugging
- No stack traces in responses

### Database Security
- Connection string in environment variables
- No credentials in code

## Performance Considerations

### Pagination
- Limits response size
- Reduces memory usage
- Improves response time

### Database Indexing
Consider adding indexes for:
- `_id` (automatic)
- `createdAt` (for sorting)
- `category` (for filtering)

### Connection Pooling
- Mongoose handles connection pooling automatically
- Reuses connections across requests

## Testing Strategy

### Unit Tests
- Test controllers in isolation
- Mock Mongoose models
- Test validation rules

### Integration Tests
- Test API endpoints end-to-end
- Use test database
- Test error scenarios

### Load Tests
- Test with many concurrent requests
- Monitor response times
- Identify bottlenecks

## Future Enhancements

### Authentication & Authorization
- Add JWT-based auth
- Role-based access control
- Middleware for protected routes

### Logging
- Request logging (Morgan)
- Error logging (Winston)
- Log aggregation

### Caching
- Redis for frequently accessed data
- Cache invalidation strategy

### API Versioning
- `/api/v1/products`
- `/api/v2/products`

### Rate Limiting
- Prevent abuse
- Protect against DDoS

### Documentation
- Swagger/OpenAPI spec
- Auto-generated API docs

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable REST API. The modular structure makes it easy to add features, test components, and onboard new developers.
