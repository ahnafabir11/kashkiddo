"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/lib/actions/task";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

interface TaskActionDropdownProps {
  taskId: string;
  className?: string;
}

export default function TaskActionDropdown({
  taskId,
  className,
}: TaskActionDropdownProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleDeleteTask() {
    setLoading(false);

    toast.promise(deleteTask(taskId), {
      loading: "Deleting Task",
      success: (data) => {
        router.push("/dashboard/tasks");
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon" disabled={loading}>
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          Edit
          <DropdownMenuShortcut>
            <Pencil className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteTask}>
          Delete
          <DropdownMenuShortcut>
            <Trash className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
