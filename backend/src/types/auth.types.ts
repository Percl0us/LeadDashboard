import { UserRole } from "./user.types";

interface AuthPayload {
  id: string;
  role: UserRole;
}
export type { AuthPayload };
