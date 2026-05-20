import { z } from "zod";
const leadSchema = z.object({
  name: z.string().min(4),
  email: z.email().lowercase(),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
  source: z.enum(["Website", "Instagram", "Referral"]),
});
export { leadSchema };
