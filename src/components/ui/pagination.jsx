import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export function DefaultPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  className,
}) {
  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => setCurrentPage(index),
  });

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <IconButton key={i} {...getItemProps(i)}>
            {i}
          </IconButton>
        );
      }
    } else {
      pages.push(
        <IconButton key={1} {...getItemProps(1)}>
          1
        </IconButton>
      );

      if (currentPage > 3) {
        pages.push(
          <span key="separator1">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <IconButton key={i} {...getItemProps(i)}>
            {i}
          </IconButton>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="separator2">
            {" "}
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </span>
        );
      }

      pages.push(
        <IconButton key={totalPages} {...getItemProps(totalPages)}>
          {totalPages}
        </IconButton>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {/* Previous Button */}
      <div className="hidden sm:block">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
      </div>
      <div className="sm:hidden">
        <IconButton onClick={prev} variant="text" disabled={currentPage === 1}>
          <ArrowLeftIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-2">{renderPageButtons()}</div>

      {/* Next Button */}
      <div className="hidden sm:block">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={currentPage === totalPages}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      <div className="sm:hidden">
        <IconButton
          onClick={next}
          variant="text"
          disabled={currentPage === totalPages}
        >
          <ArrowRightIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  );
}
