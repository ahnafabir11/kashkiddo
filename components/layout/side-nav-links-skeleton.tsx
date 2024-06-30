import { Skeleton } from "@/components/ui/skeleton";

export default function SideNavLinkSkeleton() {
  return (
    <div className="space-y-1 px-2 lg:px-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={idx} className="w-full h-9" />
      ))}
    </div>
  );
}
