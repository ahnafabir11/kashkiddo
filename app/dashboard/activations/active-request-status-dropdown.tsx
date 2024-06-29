"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { handleServerAction } from "@/lib/handle-error";
import { updateActiveRequestStatus } from "@/lib/actions/user";

export interface ActiveRequestStatusDropdownProps {
  status: boolean;
  requestId: string;
}

export default function ActiveRequestStatusDropdown({
  status,
  requestId,
}: ActiveRequestStatusDropdownProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);

    await handleServerAction(updateActiveRequestStatus({ status, requestId }), {
      loading: "Updating Active Request Status",
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
