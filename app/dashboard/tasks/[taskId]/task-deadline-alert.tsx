import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TaskDeadlineAlert() {
  return (
    <Alert variant="default">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Task Deadline Overdue</AlertTitle>
      <AlertDescription>
        You have missed the deadline for the task. Remember to complete your
        daily tasks within the same day to stay on track.
      </AlertDescription>
    </Alert>
  );
}
