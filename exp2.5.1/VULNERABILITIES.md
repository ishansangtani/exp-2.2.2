# Security & Vulnerabilities Documentation

## Overview

This document outlines security considerations, known vulnerabilities, best practices, and mitigation strategies for the Product CRUD API project.

## Current Security Status

### ✅ Implemented Security Measures
- Schema validation (Mongoose)
- Input sanitization (basic)
- Error handling without stack traces
- Type checking and data validation

### ⚠️ Missing Security Measures
- No authentication
- No authorization
- No rate limiting
- No CORS configuration
- No input sanitization for XSS
- No HTTPS enforcement
- No security headers
- Connection string in code (not environment)

### 🔴 Critical Gaps
- **Public API**: Anyone can create, update, or delete products
- **No Rate Limiting**: Vulnerable to DDoS attacks
- **No Input Validation**: Beyond schema validation
- **Error Information Leakage**: Stack traces in development

---

## Vulnerability Assessment

### 1. Authentication & Authorization

#### Risk Level: 🔴 **CRITICAL**

#### Description
The API has no authentication mechanism. Anyone with the API URL can perform any CRUD operation.

#### Attack Scenarios
- Malicious actors can delete all products
- Data theft (read all products)
- Data corruption (update products with invalid data)
- Spam (create thousands of fake products)

#### Impact
- Data loss
- Service disruption
- Reputation damage
- Compliance violations (GDPR, etc.)

#### Mitigation

**Step 1: Add JWT Authentication**
```bash
npm install jsonwebtoken bcrypt
```

```javascript
// src/middlewares/auth.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};
```

**Step 2: Protect Routes**
```javascript
// src/modules/products/product.routes.js
import { authenticate, authorize } from "../../middlewares/auth.js";

router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);
router.get("/", getProducts); // Public
router.get("/:id", getProductById); // Public
```

---

### 2. NoSQL Injection

#### Risk Level: 🟠 **HIGH**

#### Description
MongoDB is vulnerable to NoSQL injection attacks if user input is not properly validated.

#### Attack Scenarios
```javascript
// Malicious request
POST /api/products
{
  "name": { "$gt": "" },  // Matches all products
  "price": 0,
  "category": "Electronics"
}
```

```javascript
// URL query injection
GET /api/products?category[$ne]=Electronics
// Returns all products NOT in Electronics
```

#### Impact
- Unauthorized data access
- Bypass validation rules
- Data exfiltration

#### Mitigation

**Step 1: Use Mongoose Schema Validation**
✅ Already implemented - Mongoose sanitizes input automatically

**Step 2: Additional Input Sanitization**
```bash
npm install express-mongo-sanitize
```

```javascript
// src/app.js
import mongoSanitize from "express-mongo-sanitize";

app.use(mongoSanitize()); // Remove $ and . from user input
```

**Step 3: Validate Query Parameters**
```javascript
// src/modules/products/product.controller.js
const getProducts = async (req, res, next) => {
  try {
    // Whitelist allowed query params
    const allowedParams = ["page", "limit", "category"];
    const queryKeys = Object.keys(req.query);
    
    const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));
    if (invalidParams.length > 0) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }
    
    // Rest of the code...
  } catch (error) {
    next(error);
  }
};
```

---

### 3. Cross-Site Scripting (XSS)

#### Risk Level: 🟠 **HIGH**

#### Description
User input stored in the database could contain malicious scripts that execute when displayed.

#### Attack Scenarios
```javascript
POST /api/products
{
  "name": "<script>alert('XSS')</script>",
  "price": 29.99,
  "category": "Electronics"
}
```

#### Impact
- Steal user session tokens
- Redirect users to malicious sites
- Deface the application

#### Mitigation

**Step 1: Input Sanitization**
```bash
npm install xss-clean
```

```javascript
// src/app.js
import xss from "xss-clean";

app.use(xss()); // Sanitize user input
```

**Step 2: Content Security Policy**
```bash
npm install helmet
```

```javascript
// src/app.js
import helmet from "helmet";

app.use(helmet()); // Sets security headers including CSP
```

**Step 3: Output Encoding**
When displaying data in frontend, always escape HTML:
```javascript
// Example with React
<div>{escapeHtml(product.name)}</div>
```

---

### 4. Denial of Service (DoS)

#### Risk Level: 🟠 **HIGH**

#### Description
No rate limiting allows attackers to overwhelm the server with requests.

#### Attack Scenarios
- Flood server with thousands of requests per second
- Create millions of products to fill database
- Excessive pagination requests (e.g., limit=1000000)

#### Impact
- Server crash
- Database overload
- Service unavailability
- Increased hosting costs

#### Mitigation

**Step 1: Rate Limiting**
```bash
npm install express-rate-limit
```

```javascript
// src/middlewares/rateLimit.js
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit create to 10 per hour
  message: "Too many products created, please try again later.",
});
```

```javascript
// src/app.js
import { apiLimiter } from "./middlewares/rateLimit.js";

app.use("/api/", apiLimiter);
```

**Step 2: Limit Request Body Size**
```javascript
// src/app.js
app.use(express.json({ limit: "10kb" })); // Limit JSON body to 10kb
```

**Step 3: Limit Pagination**
✅ Already implemented - Max limit of 50 items

---

### 5. Sensitive Data Exposure

#### Risk Level: 🟡 **MEDIUM**

#### Description
- Connection strings in code
- Error messages reveal system details
- No HTTPS enforcement

#### Attack Scenarios
- Credentials leaked in version control
- Man-in-the-middle attacks (no HTTPS)
- Error messages reveal database structure

#### Impact
- Database compromise
- Data interception
- Information disclosure

#### Mitigation

**Step 1: Environment Variables**
```bash
npm install dotenv
```

```javascript
// .env (never commit this file!)
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/product_db
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

```javascript
// src/config/db.js
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI;
```

```
// .gitignore
node_modules/
.env
.env.local
.env.*.local
```

**Step 2: Generic Error Messages**
```javascript
// src/middlewares/errorHandler.js
const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    // Don't leak error details in production
    res.status(500).json({ message: "Internal server error" });
  } else {
    // Detailed errors in development
    console.error(error);
    res.status(500).json({ 
      message: error.message,
      stack: error.stack 
    });
  }
};
```

**Step 3: HTTPS Enforcement**
```javascript
// src/middlewares/https.js
export const enforceHttps = (req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};
```

---

### 6. Cross-Origin Resource Sharing (CORS)

#### Risk Level: 🟡 **MEDIUM**

#### Description
No CORS configuration means any website can make requests to this API.

#### Attack Scenarios
- Malicious websites make unauthorized requests
- CSRF attacks if authentication is added

#### Impact
- Unauthorized API access from untrusted origins
- Data theft via malicious websites

#### Mitigation

**Install CORS**
```bash
npm install cors
```

```javascript
// src/app.js
import cors from "cors";

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

```
// .env
ALLOWED_ORIGINS=http://localhost:3000,https://yourapp.com
```

---

### 7. Mass Assignment

#### Risk Level: 🟡 **MEDIUM**

#### Description
Accepting all request body fields allows users to modify unintended fields.

#### Attack Scenarios
```javascript
// If we add an "isAdmin" field later
PUT /api/products/:id
{
  "price": 0.01,
  "isAdmin": true  // User tries to make themselves admin
}
```

#### Impact
- Privilege escalation
- Data corruption
- Bypass business logic

#### Mitigation

**Whitelist Allowed Fields**
```javascript
// src/modules/products/product.controller.js
const updateProduct = async (req, res, next) => {
  try {
    // Whitelist allowed fields
    const allowedFields = ["name", "price", "category", "inStock"];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updates,
      { new: true, runValidators: true }
    );
    
    // Rest of code...
  } catch (error) {
    next(error);
  }
};
```

---

### 8. Insecure Dependencies

#### Risk Level: 🟢 **LOW**

#### Description
Using outdated packages with known vulnerabilities.

#### Impact
- Various vulnerabilities depending on the package
- Potential remote code execution
- Data breaches

#### Mitigation

**Regular Audits**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

**Automated Scanning**
- Use GitHub Dependabot (automated pull requests)
- Use Snyk.io for continuous monitoring
- Use npm audit in CI/CD pipeline

**Stay Updated**
```bash
# Check outdated packages
npm outdated

# Update packages
npm update
```

---

## Security Best Practices Checklist

### ✅ Implemented
- [x] Input validation (schema level)
- [x] Error handling
- [x] Pagination limits
- [x] Data type enforcement

### ⚠️ Partially Implemented
- [ ] Input sanitization (basic, needs improvement)
- [ ] Error messages (too detailed in some cases)

### ❌ Not Implemented
- [ ] Authentication
- [ ] Authorization
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] HTTPS enforcement
- [ ] Security headers (Helmet)
- [ ] Environment variables
- [ ] Input sanitization (advanced)
- [ ] Logging and monitoring
- [ ] API versioning
- [ ] Request validation middleware

---

## Recommended Security Implementation Order

### Phase 1: Critical (Implement Immediately)
1. ✅ Environment variables (.env for secrets)
2. ✅ Rate limiting
3. ✅ CORS configuration
4. ✅ Helmet (security headers)

### Phase 2: High Priority
5. ✅ Authentication (JWT)
6. ✅ Authorization (role-based)
7. ✅ NoSQL injection protection
8. ✅ XSS protection

### Phase 3: Medium Priority
9. ✅ Request logging (Morgan)
10. ✅ Mass assignment protection
11. ✅ Generic error messages
12. ✅ HTTPS enforcement

### Phase 4: Ongoing
13. ✅ Regular dependency updates
14. ✅ Security audits
15. ✅ Penetration testing
16. ✅ Code reviews

---

## Security Resources

### Tools
- **OWASP ZAP**: Web application security scanner
- **Burp Suite**: Web vulnerability scanner
- **npm audit**: Check for vulnerable dependencies
- **Snyk**: Continuous security monitoring
- **ESLint Security Plugin**: Static code analysis

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

### Learning
- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Secure Coding Guidelines](https://wiki.sei.cmu.edu/confluence/display/seccode)

---

## Incident Response Plan

### 1. Detection
- Monitor error logs for unusual patterns
- Set up alerts for failed authentication attempts
- Monitor database for unusual queries

### 2. Response
- Isolate affected systems
- Rotate credentials immediately
- Disable compromised accounts
- Collect evidence (logs, traffic)

### 3. Recovery
- Identify and patch vulnerability
- Restore from clean backup if needed
- Monitor for continued attacks

### 4. Post-Incident
- Document the incident
- Conduct root cause analysis
- Update security measures
- Train team on lessons learned

---

## Compliance Considerations

### GDPR (if handling EU user data)
- Implement data encryption
- Allow users to request data deletion
- Implement consent mechanisms
- Log data access

### PCI DSS (if handling payment data)
- Never store credit card details
- Use payment gateway (Stripe, PayPal)
- Encrypt data in transit and at rest

### HIPAA (if handling health data)
- Implement access controls
- Encrypt all data
- Maintain audit logs
- Sign Business Associate Agreements

---

## Security Contact

For security vulnerabilities, please report to:
- **Email**: security@yourcompany.com (replace with actual)
- **Bug Bounty**: (if applicable)
- **Response Time**: 48 hours

**Do not** open public issues for security vulnerabilities.

---

## Conclusion

Security is an ongoing process, not a one-time implementation. Regularly review this document, update defenses, and stay informed about new vulnerabilities and best practices.

**Current Risk Level**: 🔴 **HIGH** (due to no authentication)

**Target Risk Level**: 🟢 **LOW** (after implementing all mitigations)

**Next Steps**: Implement Phase 1 security measures immediately.
