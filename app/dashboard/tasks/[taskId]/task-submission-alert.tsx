import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TaskSubmissionAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Unable to submit task</AlertTitle>
      <AlertDescription>
        You need to active your account before submiting any task.
      </AlertDescription>
    </Alert>
  );
}
