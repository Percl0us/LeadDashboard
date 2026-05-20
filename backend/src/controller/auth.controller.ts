import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import {
  createlead,
  deleteLead,
  getleads,
  updateLead,
} from "../services/lead.service";
import { ReqWithUser } from "../types/express/ReqWithUser";
import AppError from "../utils/AppError";
import { Lead } from "../models/Lead";
export const registeruser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.body;
  try {
    const output = await registerUser(user);
    return res.status(201).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};
export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.body;
  try {
    const output = await loginUser(user);
    return res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};
export const createLead = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      next(new AppError("Unauthorized access", 401));
      return;
    }
    const output = await createlead(req.body, req.user.id);
    return res.status(201).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadsController = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    next(new AppError("Unauthorized access", 401));
    return;
  }

  try {
    const filters: any = {};

    // status filter
    if (req.query.status) {
      filters.status = req.query.status;
    }

    // source filter
    if (req.query.source) {
      filters.source = req.query.source;
    }

    // search filter
    if (req.query.search) {
      filters.$or = [
        {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    // RBAC filter
    if (req.user.role !== "Admin") {
      filters.createdBy = req.user.id;
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // sorting
    const sort = (req.query.sort as string) || "-createdAt";

    const output = await getleads(filters, page, limit, sort);

    return res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};
export const updateLeadController = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    next(new AppError("Unauthorized access", 401));
    return;
  }

  try {
    const allowedUpdates = ["name", "email", "status", "source"];

    const updates: any = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    if (typeof req.params.id != "string") {
      throw new AppError("Invalid arguments", 401);
    }
    const output = await updateLead(req.params.id, updates, req.user);

    return res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLeadController = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    next(new AppError("Unauthorized access", 401));
    return;
  }

  try {
    if (typeof req.params.id != "string") {
      throw new AppError("Invalid arguments", 401);
    }
    const output = await deleteLead(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsController = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    next(new AppError("Unauthorized access", 401));
    return;
  }

  try {
    const filters: any = {};

    // RBAC
    if (req.user.role !== "Admin") {
      filters.createdBy = req.user.id;
    }

    const leads = await Lead.find(filters);

    let csv = "Name,Email,Status,Source,CreatedAt\n";

    leads.forEach((lead) => {
      csv += `${lead.name},${lead.email},${lead.status},${lead.source},${lead.createdAt}\n`;
    });

    res.header("Content-Type", "text/csv");

    res.attachment("leads.csv");

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
