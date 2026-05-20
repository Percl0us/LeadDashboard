import { Lead } from "../models/Lead";
import { AuthPayload } from "../types/auth.types";
import { ILead } from "../types/lead.types";
import AppError from "../utils/AppError";

const createlead = async (lead: ILead, createdBy: string) => {
  const createdLead = await Lead.create({
    email: lead.email,
    name: lead.name,
    source: lead.source,
    status: lead.status,
    createdBy: createdBy,
  });
  return createdLead;
};

const getleads = async (
  filters: object,
  page: number,
  limit: number,
  sort: string,
) => {
  const skip = (page - 1) * limit;

  const leads = await Lead.find(filters).sort(sort).skip(skip).limit(limit);

  const total = await Lead.countDocuments(filters);

  return {
    leads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const updateLead = async (id: string, updates: object, user: AuthPayload) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  // RBAC ownership check
  if (user.role !== "Admin" && String(lead.createdBy) !== user.id) {
    throw new AppError("Unauthorized access", 403);
  }

  const updatedLead = await Lead.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return updatedLead;
};
const deleteLead = async (id: string, user: AuthPayload) => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  // RBAC ownership check
  if (user.role !== "Admin" && String(lead.createdBy) !== user.id) {
    throw new AppError("Unauthorized access", 403);
  }

  await Lead.findByIdAndDelete(id);

  return {
    message: "Lead deleted successfully",
  };
};

export { deleteLead, updateLead, createlead, getleads };
