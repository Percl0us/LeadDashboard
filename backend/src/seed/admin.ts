import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db";
import User from "../models/User";
import AppError from "../utils/AppError";

const registerAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const role = "Admin";

    await connectDB();

    if (password.length < 7) {
      throw new AppError("ADMIN_PASSWORD must be at least 7 characters", 400);
    }

    const isuser = await User.findOne({ email });

    if (isuser) {
      console.log(`Admin already exists for ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const output = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    console.log("Admin seeded successfully");
    console.log({
      id: String(output._id),
      email: output.email,
      role: output.role,
    });
  } catch (error) {
    console.error("Failed to seed admin");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

dotenv.config();
void registerAdmin();
