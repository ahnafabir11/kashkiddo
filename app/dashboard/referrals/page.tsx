import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminView from "./admin-view";
import UserView from "./user-view";

export default async function page({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  switch (session.user.role) {
    case "ADMIN":
      return (
        <AdminView
          searchString={searchParams.search}
          referredById={session.user.id || ""}
        />
      );
    case "USER":
      return (
        <UserView
          searchString={searchParams.search}
          referredById={session.user.id || ""}
        />
      );
    default:
      return (
        <UserView
          searchString={searchParams.search}
          referredById={session.user.id || ""}
        />
      );
  }
}
