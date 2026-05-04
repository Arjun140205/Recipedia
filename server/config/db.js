const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Reads MONGODB_URI from environment variables — crashes the process if not set.
 */
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('FATAL: MONGODB_URI is not set. Add it to your .env file and restart.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
