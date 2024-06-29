"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { handleServerAction } from "@/lib/handle-error";
import { updateUserActiveStatus } from "@/lib/actions/user";

export interface ActiveStatusDropdownProps {
  userId: string;
  status: boolean;
}

export default function ActiveStatusDropdown({
  status,
  userId,
}: ActiveStatusDropdownProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);

    await handleServerAction(updateUserActiveStatus({ status, userId }), {
      loading: "Updating User Active Status",
      finally: () => {
        setLoading(false);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading}>
        <Badge
          className="uppercase"
          variant={status ? "outline" : "destructive"}
        >
          {status.toString()}
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={status.toString()}
          onValueChange={handleUpdateStatus}
        >
          <DropdownMenuRadioItem value="true">True</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="false">False</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
