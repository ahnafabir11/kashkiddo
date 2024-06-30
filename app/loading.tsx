import { Spinner } from "@/components/spinner";

export default function loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}
