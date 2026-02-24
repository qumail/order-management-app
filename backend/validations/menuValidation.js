const { body, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// Validation for creating menu item (all fields required)
const validateMenuItem = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image')
    .notEmpty()
    .withMessage('Image URL is required'),
  body('category')
    .optional()
    .isIn(['pizza', 'burger', 'pasta', 'salad', 'drinks', 'dessert', 'other'])
    .withMessage('Invalid category'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be a boolean')
];

// Validation for updating menu item (fields optional)
const validateMenuItemUpdate = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .trim(),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image')
    .optional()
    .notEmpty()
    .withMessage('Image URL cannot be empty'),
  body('category')
    .optional()
    .isIn(['pizza', 'burger', 'pasta', 'salad', 'drinks', 'dessert', 'other'])
    .withMessage('Invalid category'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be a boolean')
];

// Middleware to check for validation errors
// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ 
//       success: false,
//       errors: errors.array() 
//     });
//   }
//   next();
// };

module.exports = {
  validateMenuItem,
  validateMenuItemUpdate,
  handleValidationErrors
};