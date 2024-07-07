"use client";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { pagination as generatePagination } from "@/lib/utils";

interface TablePaginationProps {
  total: number;
  page: number;
  perPage: number;
}

const desktop = "(min-width: 768px)";

export default function TablePagination({
  page,
  total,
  perPage,
}: TablePaginationProps) {
  const isDesktop = useMediaQuery(desktop);

  const totalPage = Math.ceil(total / perPage);
  const paginationItemCount = isDesktop ? 7 : 4;

  const getPaginationArr = generatePagination(paginationItemCount);
  const pagination = getPaginationArr(page, totalPage);

  const getUrl = (page: number, perPage: number) =>
    `/dashboard/submissions?page=${page}&per_page=${perPage}`;

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
