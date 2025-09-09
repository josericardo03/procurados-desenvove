import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = ""
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);
      
      if (currentPage <= 2) {
        // Show pages 1, 2, 3, ..., last
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push(-1); // Ellipsis
          pages.push(totalPages - 1);
        }
      } else if (currentPage >= totalPages - 3) {
        // Show first, ..., last-3, last-2, last-1, last
        if (totalPages > 4) {
          pages.push(-1); // Ellipsis
        }
        for (let i = totalPages - 4; i < totalPages; i++) {
          if (i > 0) pages.push(i);
        }
      } else {
        // Show first, ..., current-1, current, current+1, ..., last
        pages.push(-1); // Ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-1); // Ellipsis
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Itens por página:</span>
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center gap-2 px-4 py-2 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === -1) {
            return (
              <div key={`ellipsis-${index}`} className="px-3 py-2 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
            );
          }

          const isActive = currentPage === pageNum;
          
          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[44px] h-10 font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg border-0 scale-105' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm hover:shadow-md hover:scale-105'
              }`}
            >
              {pageNum + 1}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
      </div>
    </div>
  );
}