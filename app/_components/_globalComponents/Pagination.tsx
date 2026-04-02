"use client";
import React, { Dispatch, SetStateAction } from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

interface props {
  currentPage: number;
  totalPages: number;
  setCurrentPage?: Dispatch<SetStateAction<number>> | undefined;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: props) {
  const getPagination = () => {
    const pages = new Set<number>();

    pages.add(1);
    if (totalPages >= 2) pages.add(2);
    if (totalPages > 2) pages.add(totalPages);
    if (totalPages > 3) pages.add(totalPages - 1);

    if (currentPage > 1) pages.add(currentPage - 1);
    pages.add(currentPage);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    return [...pages].sort((a, b) => a - b);
  };

  const paginationNumbers = getPagination();

  const handlePageChange = (newPage: number) => {
    if (setCurrentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full min-h-[70px] bg-[#141414] rounded-md p-2 flex items-center justify-center mt-6">
      <div className="w-[95%] mx-auto max-md:flex-col max-md:gap-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-accent">{currentPage}</span>
          <span className="text-gray-500">of</span>
          <span className="text-gray-300">{totalPages}</span>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-8 h-8 max-md:w-6 max-md:h-6 flex items-center justify-center text-white bg-[#1a1a1a] rounded-md disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#222] transition-colors"
          >
            <BsArrowLeftShort className="size-6" />
          </button>

          <div className="flex items-center gap-2">
            {paginationNumbers.map((page: number, index) => {
              const prev = paginationNumbers[index - 1];
              const isEllipsis = index > 0 && page - prev > 1;

              return (
                <React.Fragment key={page}>
                  {isEllipsis && <span className="text-white px-2">...</span>}
                  <div
                    onClick={() => handlePageChange(page)}
                    className={`cursor-pointer px-4 py-1 max-md:px-2 max-md:py-0.5 flex items-center justify-center rounded-md ${
                      page === currentPage
                        ? "bg-primary_blue text-white"
                        : "bg-thired_dash text-gray-300"
                    }`}
                  >
                    {page}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-8 h-8 max-md:w-6 max-md:h-6 flex items-center justify-center text-white bg-[#1a1a1a] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222] transition-colors"
          >
            <BsArrowRightShort className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
