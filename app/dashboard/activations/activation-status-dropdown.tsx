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
import { handleUpdateActivationStatus } from "@/lib/actions/user";

export interface ActivationStatusDropdownProps {
  value: boolean;
  requestId: string;
}

export default function ActivationStatusDropdown({
  value,
  requestId,
}: ActivationStatusDropdownProps) {
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
          onValueChange={() =>
            handleUpdateActivationStatus({ value, requestId })
          }
        >
          <DropdownMenuRadioItem value="true">True</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="false">False</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
