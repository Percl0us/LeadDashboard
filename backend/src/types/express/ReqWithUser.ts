import { Request } from "express";
import { AuthPayload } from "../auth.types";

interface ReqWithUser extends Request {
  user?: AuthPayload;
}
export type { ReqWithUser };
