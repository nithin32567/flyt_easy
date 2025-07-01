import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/flyt_eazy";
  // connect local mongodb
  try {
    const conn = await mongoose.connect(MONGO_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
