const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const MenuItem = require('../models/Menu.model');

describe('Menu API', () => {
  beforeEach(async () => {
    await MenuItem.deleteMany({});
  });

  describe('GET /api/menu', () => {
    it('should return all menu items', async () => {
      await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        category: 'pizza'
      });

      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Pizza');
    });

    it('should return empty array when no menu items', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item', async () => {
      const item = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        category: 'pizza'
      });

      const res = await request(app).get(`/api/menu/${item._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Pizza');
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/menu/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/menu', () => {
    it('should create a new menu item', async () => {
      const newItem = {
        name: 'New Burger',
        description: 'Delicious burger',
        price: 8.99,
        image: 'burger.jpg',
        category: 'burger'
      };

      const res = await request(app)
        .post('/api/menu')
        .send(newItem);
      
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newItem.name);
      expect(res.body.price).toBe(newItem.price);
      expect(res.body.category).toBe(newItem.category);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidItem = {
        name: 'Test'
        // missing description, price, image
      };

      const res = await request(app)
        .post('/api/menu')
        .send(invalidItem);
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 for invalid price', async () => {
      const invalidItem = {
        name: 'Test Pizza',
        description: 'Test Description',
        price: -5,
        image: 'test.jpg'
      };

      const res = await request(app)
        .post('/api/menu')
        .send(invalidItem);
      
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('should update a menu item with partial data', async () => {
      const item = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        category: 'pizza'
      });

      const updates = {
        name: 'Updated Pizza',
        price: 12.99
      };

      const res = await request(app)
        .put(`/api/menu/${item._id}`)
        .send(updates);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updates.name);
      expect(res.body.price).toBe(updates.price);
      // Other fields should remain unchanged
      expect(res.body.description).toBe('Test Description');
      expect(res.body.image).toBe('test.jpg');
    });

    it('should update a menu item with full data', async () => {
      const item = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        category: 'pizza'
      });

      const updates = {
        name: 'Completely New Pizza',
        description: 'Brand new description',
        price: 15.99,
        image: 'new-image.jpg',
        category: 'pasta',
        available: false
      };

      const res = await request(app)
        .put(`/api/menu/${item._id}`)
        .send(updates);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updates.name);
      expect(res.body.description).toBe(updates.description);
      expect(res.body.price).toBe(updates.price);
      expect(res.body.image).toBe(updates.image);
      expect(res.body.category).toBe(updates.category);
      expect(res.body.available).toBe(updates.available);
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updates = {
        name: 'Updated Pizza'
      };

      const res = await request(app)
        .put(`/api/menu/${fakeId}`)
        .send(updates);
      
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid data', async () => {
      const item = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg'
      });

      const invalidUpdates = {
        price: -5 // Invalid negative price
      };

      const res = await request(app)
        .put(`/api/menu/${item._id}`)
        .send(invalidUpdates);
      
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('should delete a menu item', async () => {
      const item = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        image: 'test.jpg',
        category: 'pizza'
      });

      const res = await request(app).delete(`/api/menu/${item._id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Menu item deleted successfully');
      
      const deletedItem = await MenuItem.findById(item._id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/menu/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });
});