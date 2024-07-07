"use client";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  createQueryString,
  pagination as generatePagination,
} from "@/lib/utils";
import { useCallback } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { usePathname, useSearchParams } from "next/navigation";

interface TablePaginationProps {
  page: number;
  total: number;
  perPage: number;
}

const desktop = "(min-width: 768px)";

export default function TablePagination({
  page,
  total,
  perPage,
}: TablePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery(desktop);

  const totalPage = Math.ceil(total / perPage);
  const paginationItemCount = isDesktop ? 7 : 4;

  const getPaginationArr = generatePagination(paginationItemCount);
  const pagination = getPaginationArr(page, totalPage);

  const getQueryString = useCallback(createQueryString, [searchParams]);

  const getUrl = (page: number, perPage: number) => {
    const queryString = getQueryString(searchParams, {
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return `${pathname}?${queryString}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {pagination.map((item, idx) => {
          const isActive = item === page;
          const isEllipsis = typeof item === "string";

          return isEllipsis ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationLink href={getUrl(item, perPage)} isActive={isActive}>
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
