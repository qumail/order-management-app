const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    enum: {
      values: ['pizza', 'burger', 'pasta', 'salad', 'drinks', 'dessert', 'other'],
      message: '{VALUE} is not a valid category'
    },
    default: 'other'
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);