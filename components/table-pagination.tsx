"use client";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { pagination as generatePagination } from "@/lib/utils";

interface TablePaginationProps {
  page: number; 
  total: number;
  perPage: number;
  baseUrl?: string;
}

const desktop = "(min-width: 768px)";

export default function TablePagination({
  page,
  total,
  perPage,
  baseUrl,
}: TablePaginationProps) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery(desktop);

  const totalPage = Math.ceil(total / perPage);
  const paginationItemCount = isDesktop ? 7 : 4;

  const getPaginationArr = generatePagination(paginationItemCount);
  const pagination = getPaginationArr(page, totalPage);

  const BASE_URL = baseUrl ?? pathname;
  const getUrl = (page: number, perPage: number) =>
    `${BASE_URL}?page=${page}&per_page=${perPage}`;

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
