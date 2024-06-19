"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleUpdatePaymentStatus } from "@/lib/actions/payment";

export interface PaymentStatusDropdownProps {
  value: boolean;
  paymentId: string;
}

export default function PaymentStatusDropdown({
  value,
  paymentId,
}: PaymentStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <Badge
            className="uppercase"
            variant={value ? "outline" : "destructive"}
          >
            {value.toString()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value.toString()}
          onValueChange={() => handleUpdatePaymentStatus({ value, paymentId })}
        >
          <DropdownMenuRadioItem value="true">True</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="false">False</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
