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
import { updateSubmissionStatus } from "@/lib/actions/task";
import { TaskSubmissionStatus } from "@prisma/client";

interface SubmissionStatusDropdownProps {
  userId: string;
  taskId: string;
  submissionId: string;
  value: TaskSubmissionStatus;
}

export default function SubmissionStatusDropdown({
  value,
  userId,
  taskId,
  submissionId,
}: SubmissionStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <Badge
            className="uppercase"
            variant={value === "PENDING" ? "secondary" : "default"}
          >
            {value}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value.toString()}
          onValueChange={(updatedValue) =>
            updateSubmissionStatus(
              userId,
              taskId,
              submissionId,
              updatedValue as TaskSubmissionStatus
            )
          }
        >
          <DropdownMenuRadioItem value="PENDING">PENDING</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="COMPLETED">
            COMPLETED
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
