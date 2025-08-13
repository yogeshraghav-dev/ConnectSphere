import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * @param uri - MongoDB connection string
 * @param dbName - Database name
 */
export async function connectDB(uri: string, dbName: string): Promise<void> {
  try {
    await mongoose.connect(uri, { dbName });
    console.log(`✅ Connected to MongoDB [${dbName}]`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
