const Order = require('../models/Order.model');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      statusHistory: [{ status: 'Order Received', timestamp: new Date() }]
    };
    
    const order = new Order(orderData);
    await order.save();
    
    // Populate menu item details before sending response
    await order.populate('items.menuItem');
    
    // Emit real-time update
    if (req.io) {
      req.io.to(`order-${order._id}`).emit('order-updated', order);
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: 'Error creating order', details: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update status and add to history
    order.status = status;
    order.statusHistory.push({ 
      status, 
      timestamp: new Date() 
    });
    order.updatedAt = new Date();
    
    await order.save();
    await order.populate('items.menuItem');
    
    // Emit real-time update
    if (req.io) {
      req.io.to(`order-${order._id}`).emit('order-updated', order);
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Error updating order status', details: error.message });
  }
};

// Simulate order status progression
exports.simulateOrderProgress = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
    let currentIndex = statuses.indexOf(order.status);
    
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      
      // Update status immediately
      order.status = nextStatus;
      order.statusHistory.push({ 
        status: nextStatus, 
        timestamp: new Date() 
      });
      order.updatedAt = new Date();
      
      await order.save();
      await order.populate('items.menuItem');
      
      // Emit real-time update
      if (req.io) {
        req.io.to(`order-${order._id}`).emit('order-updated', order);
      }
      
      res.json({ 
        message: 'Order progress simulation started',
        currentStatus: order.status 
      });
    } else {
      res.json({ message: 'Order already delivered' });
    }
  } catch (error) {
    console.error('Error simulating order progress:', error);
    res.status(500).json({ error: 'Error simulating order progress' });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Error deleting order' });
  }
};