# Order Management System

A full-stack order management application for a food delivery service built with Next.js, Node.js, Express, and MongoDB.

## Features

- 🍔 Browse menu items with categories
- 🛒 Add items to cart with quantity management
- 📝 Place orders with delivery details
- 🔄 Real-time order status updates using Socket.io
- 📊 Track order progress through different stages
- ✅ Form validation and error handling
- 📱 Responsive design for mobile and desktop

## Tech Stack

### Frontend
- Next.js 13
- React 18
- Tailwind CSS
- Socket.io Client
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Socket.io
- Jest for testing

### DevOps
- Docker & Docker Compose
- Git

## Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Docker (optional)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/order-management-app.git
cd order-management-app


### Option 1: Local Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend

npm install

Create .env file:

echo "MONGODB_URI=mongodb://localhost:27017/order-management
PORT=5000
FRONTEND_URL=http://localhost:3000" > .env

Seed the database with menu items:

node seed.js

Start the backend server:

npm run dev

Frontend Setup
Navigate to frontend directory:

npm install

Create .env.local file:

echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

npm run dev

Open http://localhost:3000 in your browser

📡 API Endpoints
Menu
GET /api/menu - Get all menu items

GET /api/menu/:id - Get single menu item

POST /api/menu - Create menu item (admin)

PUT /api/menu/:id - Update menu item (admin)

DELETE /api/menu/:id - Delete menu item (admin)

Orders
POST /api/orders - Create new order

GET /api/orders - Get all orders

GET /api/orders/:id - Get single order

PUT /api/orders/:id/status - Update order status

POST /api/orders/:id/simulate - Simulate order progress

🧪 Testing

cd backend
npm test

npm run test:coverage