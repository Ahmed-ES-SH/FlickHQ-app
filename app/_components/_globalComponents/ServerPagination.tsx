"use client";
import Link from "next/link";
import React from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { motion } from "framer-motion";

interface props {
  currentPage: number;
  totalPages: number;
  usedURL: string;
  searchParams?: Record<string, string>;
}

export default function ServerPagination({
  currentPage,
  totalPages,
  usedURL,
  searchParams,
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

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== "page" && value) params.append(key, value);
      });
    }
    params.append("page", pageNumber.toString());
    return `${usedURL}?${params.toString()}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-16 mb-8">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-4 relative z-10 w-full max-w-4xl px-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white glass_bg border border-white/10 hover:bg-accent hover:border-accent duration-300 shadow-lg group mr-auto md:mr-0 z-20 shrink-0"
          >
            <BsArrowLeftShort className="size-6 group-hover:-translate-x-1 duration-300" />
            <span className="text-sm font-bold tracking-wider uppercase hidden md:inline">
              Prev
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-gray-500 glass_bg border border-white/5 opacity-30 cursor-not-allowed pointer-events-none mr-auto md:mr-0 shrink-0 z-20">
            <BsArrowLeftShort className="size-6" />
            <span className="text-sm font-bold tracking-wider uppercase hidden md:inline">
              Prev
            </span>
          </div>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 md:gap-2 justify-center mx-auto absolute md:relative inset-x-0 bottom-full mb-4 md:mb-0 z-0">
          {paginationNumbers.map((page: number, index) => {
            const prev = paginationNumbers[index - 1];
            const isEllipsis = index > 0 && page - prev > 1;

            return (
              <React.Fragment key={page}>
                {isEllipsis && (
                  <span className="text-gray-600 px-1 md:px-2 font-bold tracking-widest text-lg">
                    ...
                  </span>
                )}
                <Link
                  href={buildUrl(page)}
                  className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 z-10 ${
                    page === currentPage
                      ? "text-white"
                      : "text-gray-400 glass_bg border border-white/10 hover:text-white hover:border-white/30 hover:scale-105"
                  }`}
                >
                  {page === currentPage && (
                    <motion.div
                      layoutId="paginationActive"
                      className="absolute inset-0 bg-accent rounded-full -z-10 ring-2 ring-accent/50 ring-offset-2 ring-offset-black"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {page}
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white glass_bg border border-white/10 hover:bg-accent hover:border-accent duration-300 shadow-lg group ml-auto md:ml-0 z-20 shrink-0"
          >
            <span className="text-sm font-bold tracking-wider uppercase hidden md:inline">
              Next
            </span>
            <BsArrowRightShort className="size-6 group-hover:translate-x-1 duration-300" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-gray-500 glass_bg border border-white/5 opacity-30 cursor-not-allowed pointer-events-none ml-auto md:ml-0 shrink-0 z-20">
            <span className="text-sm font-bold tracking-wider uppercase hidden md:inline">
              Next
            </span>
            <BsArrowRightShort className="size-6" />
          </div>
        )}
      </div>

      {/* Center Subtitle Counter */}
      <div className="mt-8 text-center hidden md:block">
        <p className="text-[10px] md:text-xs text-gray-500 tracking-[0.2em] uppercase font-medium">
          Page <span className="text-white">{currentPage}</span> of{" "}
          <span className="text-white">{totalPages}</span>
        </p>
      </div>
    </div>
  );
}
