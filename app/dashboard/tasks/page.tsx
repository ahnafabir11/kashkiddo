import { auth } from "@/lib/auth";
import UserView from "./user-view";
import AdminView from "./admin-view";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  switch (session.user.role) {
    case "ADMIN":
      return <AdminView />;
    case "USER":
      return <UserView />;
    default:
      return <UserView />;
  }
}
