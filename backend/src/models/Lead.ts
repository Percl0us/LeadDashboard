import mongoose from "mongoose";
import { ILead } from "../types/lead.types";

const leadSchema = new mongoose.Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      required: true,
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Lead = mongoose.model<ILead>("Lead", leadSchema);
export { Lead };
