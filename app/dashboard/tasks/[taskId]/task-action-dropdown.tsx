"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTask } from "@/lib/actions/task";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskActionDropdownProps {
  taskId: string;
  className?: string;
}

export default function TaskActionDropdown({
  taskId,
  className,
}: TaskActionDropdownProps) {
  const router = useRouter();

  async function handleDeleteTask() {
    await deleteTask(taskId);
    router.push("/dashboard/tasks");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon">
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
