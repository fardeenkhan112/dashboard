import mongoose from 'mongoose';

let connectionError = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    connectionError = 'MONGODB_URI is not configured.';
    throw new Error(connectionError);
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    connectionError = null;
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    connectionError = error.message;
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

export function getDBStatus() {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    error: connectionError,
  };
}
