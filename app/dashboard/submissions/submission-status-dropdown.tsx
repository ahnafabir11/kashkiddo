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
import { TaskSubmissionStatus } from "@prisma/client";
import { updateSubmissionStatus } from "@/lib/actions/task";

interface SubmissionStatusDropdownProps {
  userId: string;
  taskId: string;
  submissionId: string;
  status: TaskSubmissionStatus;
}

export default function SubmissionStatusDropdown({
  status,
  userId,
  taskId,
  submissionId,
}: SubmissionStatusDropdownProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpdateStatus = (updatedStatus: TaskSubmissionStatus) => {
    setLoading(true);

    toast.promise(
      updateSubmissionStatus(userId, taskId, submissionId, updatedStatus),
      {
        loading: "Updating Submission Status",
        success: (data) => {
          return data.message;
        },
        error: (data) => {
          return data.message;
        },
        finally: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading}>
        <Badge
          className="uppercase"
          variant={status === "PENDING" ? "secondary" : "default"}
        >
          {status}
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={status.toString()}
          onValueChange={(status) =>
            handleUpdateStatus(status as TaskSubmissionStatus)
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
