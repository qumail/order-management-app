const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const Order = require('../models/Order.model');
const MenuItem = require('../models/Menu.model');

describe('Order API', () => {
  let testMenuItem;

  beforeEach(async () => {
    await Order.deleteMany({});
    await MenuItem.deleteMany({});
    
    testMenuItem = await MenuItem.create({
      name: 'Test Pizza',
      description: 'Test Description',
      price: 10.99,
      image: 'test.jpg',
      category: 'pizza'
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order with status history', async () => {
      const newOrder = {
        items: [
          {
            menuItem: testMenuItem._id.toString(),
            quantity: 2,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price * 2,
        customer: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '+1234567890'
        }
      };

      const res = await request(app)
        .post('/api/orders')
        .send(newOrder);
      
      expect(res.status).toBe(201);
      expect(res.body.customer.name).toBe(newOrder.customer.name);
      expect(res.body.totalAmount).toBe(newOrder.totalAmount);
      expect(res.body.status).toBe('Order Received');
      expect(res.body.statusHistory).toHaveLength(1);
      expect(res.body.statusHistory[0].status).toBe('Order Received');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status and add to history', async () => {
      // Create an order
      const order = await Order.create({
        items: [
          {
            menuItem: testMenuItem._id,
            quantity: 1,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price,
        customer: {
          name: 'Jane Doe',
          address: '456 Oak Ave',
          phone: '+9876543210'
        },
        status: 'Order Received',
        statusHistory: [{ status: 'Order Received', timestamp: new Date() }]
      });

      // Update status
      const res = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .send({ status: 'Preparing' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Preparing');
      expect(res.body.statusHistory).toHaveLength(2);
      
      // Check that both statuses are in history
      const statuses = res.body.statusHistory.map(h => h.status);
      expect(statuses).toContain('Order Received');
      expect(statuses).toContain('Preparing');
      
      // Check timestamps are present
      res.body.statusHistory.forEach(history => {
        expect(history.timestamp).toBeDefined();
        expect(new Date(history.timestamp)).toBeInstanceOf(Date);
      });
    });

    it('should update status multiple times and maintain history', async () => {
      // Create an order
      const order = await Order.create({
        items: [
          {
            menuItem: testMenuItem._id,
            quantity: 1,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price,
        customer: {
          name: 'Jane Doe',
          address: '456 Oak Ave',
          phone: '+9876543210'
        },
        status: 'Order Received',
        statusHistory: [{ status: 'Order Received', timestamp: new Date() }]
      });

      // Update to Preparing
      const res1 = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .send({ status: 'Preparing' });
      
      expect(res1.status).toBe(200);
      expect(res1.body.statusHistory).toHaveLength(2);

      // Update to Out for Delivery
      const res2 = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .send({ status: 'Out for Delivery' });
      
      expect(res2.status).toBe(200);
      expect(res2.body.status).toBe('Out for Delivery');
      expect(res2.body.statusHistory).toHaveLength(3);
      
      // Verify all statuses are in history
      const statuses = res2.body.statusHistory.map(h => h.status);
      expect(statuses).toEqual(['Order Received', 'Preparing', 'Out for Delivery']);
    });

    it('should return 400 for invalid status', async () => {
      const order = await Order.create({
        items: [
          {
            menuItem: testMenuItem._id,
            quantity: 1,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price,
        customer: {
          name: 'Jane Doe',
          address: '456 Oak Ave',
          phone: '+9876543210'
        }
      });

      const res = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .send({ status: 'Invalid Status' });
      
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/orders/${fakeId}/status`)
        .send({ status: 'Preparing' });
      
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order with populated menu items', async () => {
      const order = await Order.create({
        items: [
          {
            menuItem: testMenuItem._id,
            quantity: 1,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price,
        customer: {
          name: 'Jane Doe',
          address: '456 Oak Ave',
          phone: '+9876543210'
        }
      });

      const res = await request(app).get(`/api/orders/${order._id}`);
      expect(res.status).toBe(200);
      expect(res.body.items[0].menuItem.name).toBe('Test Pizza');
    });
  });

  describe('POST /api/orders/:id/simulate', () => {
    it('should start simulation and update status', async () => {
      const order = await Order.create({
        items: [
          {
            menuItem: testMenuItem._id,
            quantity: 1,
            price: testMenuItem.price
          }
        ],
        totalAmount: testMenuItem.price,
        customer: {
          name: 'Jane Doe',
          address: '456 Oak Ave',
          phone: '+9876543210'
        }
      });

      const res = await request(app).post(`/api/orders/${order._id}/simulate`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Order progress simulation started');
      
      // Check that status was updated
      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder.status).not.toBe('Order Received');
      expect(updatedOrder.statusHistory.length).toBeGreaterThan(1);
    });
  });
});