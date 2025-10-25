import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    handleNext: () => void;
    handlePrev: () => void;
    setCurrentPage: (page: number) => void;
    pageCount?: number;
    currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    handleNext,
    handlePrev,
    setCurrentPage,
    pageCount = 0,
    currentPage = 1,
}) => {
    const pagesArr = Array.from({ length: pageCount }, (_, i) => i + 1);
    const breakLimit = 5;
    const totalPage = pagesArr.length;
    const endLimit = totalPage - breakLimit + 1;

    let paginationsElements: Array<{ pageNum: string | number }> = [];

    if (totalPage <= breakLimit) {
        pagesArr.forEach((el) => paginationsElements.push({ pageNum: el }));
    } else if (breakLimit > currentPage) {
        const stRange = pagesArr.slice(0, breakLimit);
        stRange.forEach((v) => paginationsElements.push({ pageNum: v }));
        paginationsElements.push({ pageNum: "..." });
        paginationsElements.push({ pageNum: totalPage });
    } else if (currentPage >= breakLimit && currentPage < endLimit + 1) {
        paginationsElements.push({ pageNum: 1 });
        paginationsElements.push({ pageNum: "..." });
        const midRange = pagesArr.slice(currentPage - 2, currentPage + 1);
        midRange.forEach((v) => paginationsElements.push({ pageNum: v }));
        paginationsElements.push({ pageNum: "..." });
        paginationsElements.push({ pageNum: totalPage });
    } else if (currentPage > endLimit) {
        paginationsElements.push({ pageNum: 1 });
        paginationsElements.push({ pageNum: "..." });
        const endRange = pagesArr.slice(endLimit, totalPage);
        endRange.forEach((v) => paginationsElements.push({ pageNum: v }));
    }

    if (totalPage <= 1) {
        return <></>
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationsElements.map((obj, i) =>
                isNaN(Number(obj.pageNum)) ? (
                    <span key={i} className="px-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(Number(obj.pageNum))}
                        className={`px-3 py-1 rounded-md border border-accent text-sm transition
              ${currentPage === obj.pageNum
                                ? "bg-primary text-primary-foreground border-accent"
                                : "hover:bg-primary/10 cursor-pointer"
                            }`}
                    >
                        {obj.pageNum}
                    </button>
                )
            )}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPage}
                className={`p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
