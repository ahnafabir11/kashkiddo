"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { signoutUser } from "@/lib/actions/user";
import { handleServerAction } from "@/lib/handle-error";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function LogoutDropdownMenuItem({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    setLoading(true);

    await handleServerAction(signoutUser(), {
      loading: "Loging Out User",
      success: () => {
        router.push("/login");
      },
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={loading}>
      {children}
    </DropdownMenuItem>
  );
}
