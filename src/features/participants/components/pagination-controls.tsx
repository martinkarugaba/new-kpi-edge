"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const pageSizeOptions = [10, 20, 30, 50];

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
  currentPage,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground text-sm">Rows per page:</div>
        <Select
          value={pageSize.toString()}
          onValueChange={value => {
            const newSize = parseInt(value);
            onPageSizeChange?.(newSize);
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue aria-label={pageSize.toString()}>
              {pageSize}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-muted-foreground text-sm">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!hasPrevPage}
            onClick={() => {
              const newPage = currentPage > 1 ? currentPage - 1 : 1;
              onPageChange?.(newPage);
            }}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            disabled={!hasNextPage}
            onClick={() => {
              onPageChange?.(currentPage + 1);
            }}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
