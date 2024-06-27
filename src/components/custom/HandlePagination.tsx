"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const HandlePagination = ({ total }: { total: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const totalPages = Math.ceil(total / limit);

  function createPageURL(pageNumber: number | string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  const paginationItems = [];

  // Add previous button
  paginationItems.push(
    <PaginationItem key="previous">
      <PaginationPrevious
        href={createPageURL(currentPage - 1)}
        className={currentPage === 1 ? "pointer-events-none" : ""}
      />
    </PaginationItem>,
  );

  // Determine start and end page numbers
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > 5) {
    if (currentPage <= 3) {
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Add ellipsis if startPage > 1
  if (startPage > 1) {
    paginationItems.push(
      <PaginationItem key="start-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>,
    );
  }

  // Add page number buttons
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink
          href={createPageURL(i)}
          isActive={currentPage === i}
          className={currentPage === i ? "pointer-events-none" : ""}
        >
          {i}
        </PaginationLink>
      </PaginationItem>,
    );
  }

  // Add ellipsis if endPage < totalPages
  if (endPage < totalPages) {
    paginationItems.push(
      <PaginationItem key="end-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>,
    );
  }

  // Add next button
  paginationItems.push(
    <PaginationItem key="next">
      <PaginationNext
        href={createPageURL(currentPage + 1)}
        className={currentPage === totalPages ? "pointer-events-none" : ""}
      />
    </PaginationItem>,
  );

  return (
    <Pagination>
      <PaginationContent>{paginationItems}</PaginationContent>
    </Pagination>
  );
};

export default HandlePagination;
