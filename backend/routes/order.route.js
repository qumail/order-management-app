const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { 
  validateOrder, 
  validateOrderStatus, 
  handleValidationErrors 
} = require('../validations/orderValidation');

// // Validation middleware
// const validateOrder = [
//   body('items').isArray({ min: 1 }),
//   body('items.*.menuItem').notEmpty(),
//   body('items.*.quantity').isInt({ min: 1 }),
//   body('totalAmount').isFloat({ min: 0 }),
//   body('customer.name').notEmpty().trim(),
//   body('customer.address').notEmpty().trim(),
//   body('customer.phone').notEmpty().matches(/^[0-9+\-\s()]+$/),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// Routes
router.post('/', validateOrder, handleValidationErrors, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', validateOrderStatus, handleValidationErrors, orderController.updateOrderStatus);
router.post('/:id/simulate', orderController.simulateOrderProgress);

module.exports = router;