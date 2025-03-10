/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<CachedConnection> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

async function connectDB(): Promise<CachedConnection> {
  if (cached.conn) {
    return cached;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      cached.conn = mongoose;
      return cached;
    });
  }

  try {
    await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached;
}

export default connectDB; 