import mongoose from "mongoose";

import type {UserInterface} from '../types/user.types';
const UserSchema = new mongoose.Schema<UserInterface>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Sales"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserInterface>("User", UserSchema);
export default User;

