"use client";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signoutUser } from "@/lib/actions/user";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function LogoutDropdownMenuItem({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    setLoading(true);

    toast.promise(signoutUser, {
      loading: "Loging Out User",
      success: (data) => {
        router.push("/login");
        return data.message;
      },
      error: (data) => {
        return data.message;
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
