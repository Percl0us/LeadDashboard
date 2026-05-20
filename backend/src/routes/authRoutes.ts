import { Router } from "express";
import {
  createLead,
  deleteLeadController,
  exportLeadsController,
  getLeadsController,
  loginUserController,
  registeruser,
  updateLeadController,
} from "../controller/auth.controller";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ZodUserSchema } from "../validators/auth.validator";
import validate from "../middleware/validate";
import { leadSchema } from "../validators/lead.validator";
const router = Router();

router.post("/register", validate(ZodUserSchema), registeruser);
router.post("/login", validate(ZodUserSchema), loginUserController);
router.post("/lead/create", AuthMiddleware, validate(leadSchema), createLead);
router.get("/lead", AuthMiddleware, getLeadsController);
router.patch("/lead/:id", AuthMiddleware, updateLeadController);
router.delete("/lead/:id", AuthMiddleware, deleteLeadController);
router.get("/lead/export", AuthMiddleware, exportLeadsController);
export default router;
