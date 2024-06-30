import { Spinner } from "@/components/spinner";

export default function loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
