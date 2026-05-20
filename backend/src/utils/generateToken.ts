import jwt from "jsonwebtoken";
import { UserRole } from "../types/user.types";
interface Ipayload {
  id: string;
  role: UserRole;
}
const generateToken = (payload: Ipayload, secretkey: string) => {
  const token = jwt.sign(payload, secretkey, {
    expiresIn: "1d",
  });
  return token;
};
export default generateToken;
