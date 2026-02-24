const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { server } = require('../app');

let mongoServer;

// Setup in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect and stop mongodb server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  
  // Close the server if it's running (for safety)
  if (server && server.listening) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
});