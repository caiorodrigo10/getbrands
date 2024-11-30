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
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Se tiver 5 páginas ou menos, mostra todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Sempre adiciona página 1
    pages.push(1);

    if (currentPage <= 4) {
      // Se estiver nas primeiras 4 páginas
      pages.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Se estiver nas últimas 4 páginas
      pages.push(
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      // No meio
      pages.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-gray-900`}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page as number)}
                isActive={currentPage === page}
                className={`cursor-pointer text-gray-900 ${
                  currentPage === page ? "bg-primary text-white hover:bg-primary/90" : ""
                }`}
              >
                {page}
              </PaginationLink>
            )}
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