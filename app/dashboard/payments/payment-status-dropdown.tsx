"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { updatePaymentStatus } from "@/lib/actions/payment";

export interface PaymentStatusDropdownProps {
  status: boolean;
  paymentId: string;
}

export default function PaymentStatusDropdown({
  status,
  paymentId,
}: PaymentStatusDropdownProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpdateStatus = () => {
    setLoading(true);

    toast.promise(updatePaymentStatus({ status, paymentId }), {
      loading: "Upadating Payment Status",
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
