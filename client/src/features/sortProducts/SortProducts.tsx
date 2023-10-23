import { ChangeEvent } from 'react';
import { sortOptionsArray } from '@hooks/useSortProducts';

type SortProductsPropsTypes = {
  category: string;
  sortOption: string | null;
  sortOptionChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function SortProducts({
  category,
  sortOption,
  sortOptionChangeHandler,
}: SortProductsPropsTypes) {
  if (!sortOption) return null;
  return (
    <div>
      <label htmlFor={`${category}-SortProducts`} className="sr-only">
        SortBy
      </label>
      <select
        id={`${category}-SortProducts`}
        value={sortOption}
        onChange={(e) => sortOptionChangeHandler(e)}
        className="h-10 cursor-pointer rounded border-gray-300 text-sm"
      >
        {sortOptionsArray.map((option) => (
          <option key={option.key} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
}
