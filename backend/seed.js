const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./models/Menu.model');

const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella cheese, basil, and olive oil on a crispy thin crust',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
    category: 'pizza',
    available: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
    category: 'pizza',
    available: true
  },
  {
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, onion, pickles, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    category: 'burger',
    available: true
  },
  {
    name: 'Cheeseburger',
    description: 'Classic burger with American cheese, lettuce, tomato, and onion',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop',
    category: 'burger',
    available: true
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon, eggs, and Parmesan cheese',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop',
    category: 'pasta',
    available: true
  },
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, Parmesan cheese with Caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=200&fit=crop',
    category: 'salad',
    available: true
  },
  {
    name: 'Greek Salad',
    description: 'Fresh cucumbers, tomatoes, olives, feta cheese with olive oil',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
    category: 'salad',
    available: true
  },
  {
    name: 'Coca Cola',
    description: 'Ice-cold Coca Cola (330ml)',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop',
    category: 'drinks',
    available: true
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
    category: 'dessert',
    available: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/order-management');
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`Inserted ${inserted.length} menu items`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();