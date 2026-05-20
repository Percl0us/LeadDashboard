import mongoose from "mongoose";
import { UserInterface } from "./user.types";

type StatusType = "New" | "Contacted" | "Qualified" | "Lost";
type SourceType = "Website" | "Instagram" | "Referral";
interface ILead {
  name: string;
  email: string;
  status: StatusType;
  source: SourceType;
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export type { ILead };
