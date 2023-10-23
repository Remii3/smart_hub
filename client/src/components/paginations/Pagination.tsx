import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import usePagination from '@hooks/usePagination';

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
}: {
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (e: number) => void;
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = Number(
    paginationRange && paginationRange[paginationRange.length - 1]
  );

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className={`${
          currentPage <= 1 && 'opacity-40'
        } px-3 transition duration-200 ease-in-out`}
      >
        <ChevronLeftIcon height={24} width={24} />
      </button>
      <ul className="flex justify-evenly space-x-2">
        {paginationRange &&
          paginationRange.map((pageNumber, i) => {
            if (pageNumber === 'DOTS') {
              return (
                <li
                  key={pageNumber.toString() + i}
                  className="pagination-item dots flex items-center justify-center p-3"
                >
                  &#8230;
                </li>
              );
            }

            return (
              <li key={pageNumber.toString() + i} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onPageChange(Number(pageNumber))}
                  className={`${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-background'
                      : 'hover:bg-blue-300'
                  } flex items-center justify-center rounded-lg px-3 py-2 transition-all duration-200 ease-in-out`}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}
      </ul>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= lastPage}
        className={`${
          currentPage >= lastPage && 'opacity-40'
        } px-3 transition duration-200 ease-in-out`}
      >
        <ChevronRightIcon height={24} width={24} />
      </button>
    </div>
  );
}
