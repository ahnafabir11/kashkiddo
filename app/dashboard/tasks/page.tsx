import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminView from "./admin-view";
import UserView from "./user-view";

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
