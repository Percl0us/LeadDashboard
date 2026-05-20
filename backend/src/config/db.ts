import mongoose from "mongoose";
import AppError from "../utils/AppError";

const connectDB = async () => {
  const dburl = process.env.DATABASE_URL;

  if (!dburl) {
    throw new AppError("DATABASE_URL is not configured", 500);
  }

  await mongoose.connect(dburl);
  console.log("Database connected successfully");
};

export default connectDB;
