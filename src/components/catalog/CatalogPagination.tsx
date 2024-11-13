import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CatalogPagination = ({ currentPage, totalPages, onPageChange }: CatalogPaginationProps) => {
  return (
    <Pagination>
      <PaginationContent className="text-gray-900">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-gray-900`}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page} className="hidden md:block">
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
              className="cursor-pointer text-gray-900"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-gray-900`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CatalogPagination;