"use client";

import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TableToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString, 1000);

  const getQueryString = useCallback(createQueryString, [searchParams]);
  const queryString = getQueryString(searchParams, {
    search: debouncedSearchString,
  });

  useEffect(() => {
    router.push(`${pathname}?${queryString}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  return (
    <div className="w-full">
      <Input
        placeholder="Search items..."
        onChange={(e) => setSearchString(e.target.value)}
        className="md:max-w-xs"
      />
    </div>
  );
}
