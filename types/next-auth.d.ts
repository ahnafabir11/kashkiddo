import { Role, User as UserType } from "@prisma/client";

declare module "next-auth" {
  interface User
    extends Omit<UserType, "password" | "createdAt" | "updatedAt"> {}
}
