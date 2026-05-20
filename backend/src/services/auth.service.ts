import User from "../models/User";
import { RegisterUserInterface, UserInterface } from "../types/user.types";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";
const registerUser = async (user: RegisterUserInterface) => {
  const secretkey = process.env.secretkey;
  if (!secretkey) {
    throw new AppError("Internal Server Error", 500);
  }
  const isuser = await User.findOne({
    email: user.email,
  });
  if (isuser) {
    throw new AppError("User already registered", 409);
  }

  const newpassword = await bcrypt.hash(user.password, 10);

  const userobj = { ...user };
  userobj.password = newpassword;
  const obj = await User.create({ ...userobj, role: "Sales" });
  const token = generateToken(
    { id: String(obj._id), role: obj.role },
    secretkey,
  );

  return {
    token,
    user: { id: String(obj._id), email: obj.email, role: obj.role },
  };
};
const loginUser = async (user: RegisterUserInterface) => {
  const isuser = await User.findOne({ email: user.email }).select("+password");
  if (!isuser) {
    throw new AppError("Invalid Credentials", 401);
  }
  const ispass = await bcrypt.compare(user.password, isuser.password);
  if (!ispass) {
    throw new AppError("Invalid Credentials", 401);
  }
  const secretkey = process.env.secretkey;
  if (!secretkey) {
    throw new AppError("Internal Server Error", 500);
  }

  const t = generateToken(
    { id: String(isuser._id), role: isuser.role },
    secretkey,
  );
  return {
    token: t,
    user: { id: String(isuser._id), email: isuser.email, role: isuser.role },
  };
};
export { registerUser, loginUser };
