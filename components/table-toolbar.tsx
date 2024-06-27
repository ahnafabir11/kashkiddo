"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function TableToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchString, setSearchString] = useState<string>("");
  const debouncedSearchString = useDebounce(searchString, 1000);

  useEffect(() => {
    if (!debouncedSearchString) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?search=${debouncedSearchString}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchString]);

  return (
    <div>
      <Input
        placeholder="Search items..."
        onChange={(e) => setSearchString(e.target.value)}
      />
    </div>
  );
}
