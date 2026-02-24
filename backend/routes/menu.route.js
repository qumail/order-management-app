const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { 
  validateMenuItem, 
  validateMenuItemUpdate, 
  handleValidationErrors 
} = require('../validations/menuValidation');

// Validation middleware
// const validateMenuItem = [
//   body('name').notEmpty().trim(),
//   body('description').notEmpty(),
//   body('price').isFloat({ min: 0 }),
//   body('image').notEmpty(),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// Routes
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItem);
router.post('/', validateMenuItem, handleValidationErrors, menuController.createMenuItem);
router.put('/:id', validateMenuItemUpdate, handleValidationErrors, menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;