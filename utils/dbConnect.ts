import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}


interface Cached {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  }

  let cached: Cached = global.mongoose as Cached || { conn: null, promise: null };

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });


async function dbConnect(): Promise<mongoose.Mongoose>  {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
        console.log('MongoDB connection established.');
        return mongoose});
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
