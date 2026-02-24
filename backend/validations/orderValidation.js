const { body, validationResult } = require('express-validator');

// Validation for creating order
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Menu item ID is required')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('customer.name')
    .notEmpty()
    .withMessage('Customer name is required')
    .trim(),
  body('customer.address')
    .notEmpty()
    .withMessage('Delivery address is required')
    .trim(),
  body('customer.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
];

// Validation for updating order status
const validateOrderStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'])
    .withMessage('Invalid order status')
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateOrder,
  validateOrderStatus,
  handleValidationErrors
};