import { z } from "zod";
const ZodUserSchema = z.object({
  email: z.email(),
  password: z.string().min(7),
});
export { ZodUserSchema };
