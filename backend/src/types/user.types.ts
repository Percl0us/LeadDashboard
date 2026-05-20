type UserRole = "Admin" | "Sales";
interface UserInterface {
  email: string;
  password: string;
  role: UserRole;
}
interface RegisterUserInterface {
  email: string;
  password: string;
}

export type { UserRole };
export type { UserInterface, RegisterUserInterface };
