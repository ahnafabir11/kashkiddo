import { Loader } from "lucide-react";

export const Spinner = () => {
  return (
    <div aria-label="Loading..." role="status" className="flex items-center">
      <Loader className="animate-spin w-4 h-4" />
      <span className="text-sm ml-2">Loading...</span>
    </div>
  );
};
