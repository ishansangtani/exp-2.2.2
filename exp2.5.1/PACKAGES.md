# Package Documentation

## Overview

This document provides detailed information about all packages used in the project, their purposes, versions, and usage patterns.

## Dependencies

### 1. Express.js

**Package**: `express`  
**Version**: `^5.2.1`  
**License**: MIT  
**Website**: https://expressjs.com/

#### Purpose
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

#### Why We Use It
- Standard de facto for Node.js web applications
- Lightweight and unopinionated
- Excellent middleware ecosystem
- Easy routing and request handling
- Great documentation and community support

#### Key Features Used
- **Routing**: Define API endpoints with HTTP methods
- **Middleware**: Parse JSON, handle errors
- **Request/Response**: Handle HTTP request and response objects
- **Router**: Modular route handlers

#### Usage in Project
```javascript
import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Error handling
app.use((error, req, res, next) => {
  res.status(500).json({ message: "Error" });
});
```

#### Configuration
- **Port**: 3000 (default) or from environment variable
- **JSON Parser**: Built-in `express.json()` middleware
- **Body Size Limit**: Default (100kb)

---

### 2. Mongoose

**Package**: `mongoose`  
**Version**: `^9.2.1`  
**License**: MIT  
**Website**: https://mongoosejs.com/

#### Purpose
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data.

#### Why We Use It
- Schema validation and type casting
- Middleware (hooks) for business logic
- Built-in validation
- Query building and population
- Better developer experience than native MongoDB driver

#### Key Features Used
- **Schemas**: Define data structure and validation rules
- **Models**: Compiled schema constructors
- **Validation**: Built-in validators (required, min, max, enum)
- **Timestamps**: Automatic `createdAt` and `updatedAt`
- **Instance Methods**: Custom methods on documents
- **Query Helpers**: Find, update, delete operations

#### Usage in Project
```javascript
import mongoose from "mongoose";

// Schema definition
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Accessories", "Home", "Office", "Other"]
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Instance method
productSchema.methods.applyDiscount = function(percent) {
  this.price = this.price * (1 - percent / 100);
  return this.price;
};

// Model
const Product = mongoose.model("Product", productSchema);
```

#### Configuration
- **Connection URI**: `mongodb://127.0.0.1:27017/product_db`
- **Connection Options**: Default (handled by Mongoose 6+)
- **Strict Mode**: Enabled (default)
- **Timestamps**: Enabled for Product model

#### Database Schema
```
Product Collection:
{
  _id: ObjectId,
  name: String (2-80 chars, required),
  price: Number (≥0, required),
  category: Enum (required),
  inStock: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto),
  __v: Number (version key)
}
```

---

### 3. Nodemon

**Package**: `nodemon`  
**Version**: `^3.1.11`  
**License**: MIT  
**Website**: https://nodemon.io/

#### Purpose
Nodemon is a utility that monitors for changes in your source code and automatically restarts your server during development.

#### Why We Use It
- Faster development workflow
- No need to manually restart server after code changes
- Automatic file watching
- Configurable watch patterns

#### Key Features Used
- **Auto-restart**: Watches file changes and restarts
- **Import Support**: Works with ES modules
- **Delay**: Prevents excessive restarts

#### Usage in Project
```json
// package.json
{
  "scripts": {
    "dev": "nodemon index.js"
  }
}
```

#### Run Command
```bash
npm run dev
```

#### Configuration
Nodemon uses default configuration:
- **Watch**: All `.js` files
- **Ignore**: `node_modules/`, `.git/`
- **Delay**: 1000ms before restart
- **Extensions**: `.js, .json`

#### Optional Configuration File (`nodemon.json`)
```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["*.test.js", "node_modules/"],
  "delay": "2000"
}
```

---

## Package Comparison

### Express vs Alternatives

| Feature           | Express   | Fastify       | Koa       | Hapi      |
|---------          |---------  |---------      |-----      |------     |
| Performance       | Good      | Excellent     | Good      | Good      |
| Learning Curve    | Easy      | Moderate      | Moderate  | Steep     |
| Middleware        | Rich      | Growing       | Minimal   | Built-in  |
| Community         | Largest   | Growing       | Medium    | Medium    |
| Type Safety       | No        | Better        | No        | Better    |

**Why Express**: Mature ecosystem, extensive documentation, industry standard.

### Mongoose vs Alternatives

| Feature           | Mongoose  | Native Driver | Prisma    | TypeORM       |
|---------          |---------- |---------------|--------   |---------      |
| Schema Validation | Yes       | No            | Yes       | Yes           |
| Type Safety       | Partial   | No            | Excellent | Excellent     |
| Query API         | Chainable | Verbose       | Fluent    | Repository    |
| Learning Curve    | Easy      | Easy          | Moderate  | Moderate      |
| MongoDB-specific  | Yes       | Yes           | Multi-DB  | Multi-DB      |

**Why Mongoose**: Best for MongoDB, excellent validation, mature and stable.

---

## Version Management

### Semantic Versioning
All packages use semantic versioning (semver):
- `^5.2.1` means `>=5.2.1 <6.0.0`
- Caret (^) allows minor and patch updates
- Major version locked to prevent breaking changes

### Update Strategy
```bash
# Check for updates
npm outdated

# Update packages (respecting semver)
npm update

# Update to latest (including major versions)
npm install express@latest mongoose@latest
```

---

## Package Scripts

### Available Scripts

#### `npm run dev`
Starts the development server with auto-reload.
```bash
nodemon index.js
```

#### `npm start` (not defined)
For production, add:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

#### `npm test` (placeholder)
Currently returns error. Add testing framework:
```bash
npm install --save-dev jest supertest
```

---

## Production Dependencies vs Dev Dependencies

### Current Setup
All packages are in `dependencies`. For better organization:

#### Should be Dev Dependencies
- `nodemon` (only used in development)

#### Recommended Structure
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

#### Fix
```bash
npm uninstall nodemon
npm install --save-dev nodemon
```

---

## Additional Recommended Packages

### 1. Environment Variables
```bash
npm install dotenv
```
**Usage**: Load `.env` files
```javascript
import dotenv from "dotenv";
dotenv.config();
```

### 2. CORS
```bash
npm install cors
```
**Usage**: Enable Cross-Origin Resource Sharing
```javascript
import cors from "cors";
app.use(cors());
```

### 3. Helmet
```bash
npm install helmet
```
**Usage**: Secure Express apps with HTTP headers
```javascript
import helmet from "helmet";
app.use(helmet());
```

### 4. Morgan
```bash
npm install morgan
```
**Usage**: HTTP request logger
```javascript
import morgan from "morgan";
app.use(morgan("dev"));
```

### 5. Express Validator
```bash
npm install express-validator
```
**Usage**: Additional validation for request data
```javascript
import { body, validationResult } from "express-validator";
```

### 6. Testing
```bash
npm install --save-dev jest supertest @types/jest
```
**Usage**: Unit and integration testing

---

## Package Size Analysis

| Package | Unpacked Size | Dependencies |
|---------|---------------|--------------|
| express | ~250 KB | 57 |
| mongoose | ~1.5 MB | 35 |
| nodemon | ~500 KB | 34 |
| **Total** | **~2.25 MB** | **126** |

---

## License Compliance

All packages use MIT license:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty disclaimers apply

---

## Performance Considerations

### Express
- Lightweight: Minimal overhead
- Single-threaded: Use clustering for multi-core
- Middleware order matters: Put error handlers last

### Mongoose
- Connection pooling: Reuses connections (default pool size: 5)
- Lean queries: Use `.lean()` for read-only operations
- Indexing: Create indexes on frequently queried fields

### Nodemon
- Development only: Don't use in production
- File watching overhead: Minimal impact

---

## References

- [Express Documentation](https://expressjs.com/en/5x/api.html)
- [Mongoose Guides](https://mongoosejs.com/docs/guides.html)
- [Nodemon Documentation](https://nodemon.io/#docs)
- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)

---

## Maintenance

### Regular Tasks
- ✅ Check for security vulnerabilities: `npm audit`
- ✅ Update dependencies monthly: `npm update`
- ✅ Review breaking changes before major updates
- ✅ Test thoroughly after updates

### Security
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Fix with breaking changes (careful!)
npm audit fix --force
```
