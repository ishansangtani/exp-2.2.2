const { body, validationResult } = require('express-validator');

// Validation rules for student creation/update
const studentValidationRules = () => {
  return [
    body('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('rollNumber')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Roll number is required')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Roll number must contain only uppercase letters and numbers'),
    
    body('course')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Course is required'),
    
    body('marks')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Marks must be between 0 and 100'),
    
    body('phone')
      .trim()
      .matches(/^\d{10}$/)
      .withMessage('Phone number must be exactly 10 digits'),
    
    body('address')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Address is required'),
    
    body('city')
      .trim()
      .not()
      .isEmpty()
      .withMessage('City is required'),
    
    body('state')
      .trim()
      .not()
      .isEmpty()
      .withMessage('State is required')
  ];
};

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('error', {
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  studentValidationRules,
  validate
};
