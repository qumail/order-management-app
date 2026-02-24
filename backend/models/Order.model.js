const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be a positive number']
  }
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true }); // Generate _id for each history entry

const orderSchema = new mongoose.Schema({
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount must be a positive number']
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Order Received'
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Ensure statusHistory is initialized when creating a new order
orderSchema.pre('validate', function(next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{ status: this.status || 'Order Received' }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);