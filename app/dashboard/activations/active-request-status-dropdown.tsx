"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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

  const handleUpdateStatus = () => {
    setLoading(true);

    toast.promise(updateActiveRequestStatus({ status, requestId }), {
      loading: "Updating Active Request Status",
      success: (data) => {
        return data.message;
      },
      error: (data) => {
        return data.message;
      },
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
