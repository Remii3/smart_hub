import { ChangeEvent } from 'react';
import { sortProductsTypes } from '../../../hooks/useSortProducts';

type SortProductsPropsTypes = {
  category: string;
  sortOption: string;
  sortOptionChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function SortProducts({
  category,
  sortOption,
  sortOptionChangeHandler,
}: SortProductsPropsTypes) {
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
        <option hidden>Sort By</option>
        <option value={sortProductsTypes.DATE_DESC}>
          {sortProductsTypes.DATE_DESC}
        </option>
        <option value={sortProductsTypes.DATE_ASC}>
          {sortProductsTypes.DATE_ASC}
        </option>
        <option value={sortProductsTypes.TITLE_DESC}>
          {sortProductsTypes.TITLE_DESC}
        </option>
        <option value={sortProductsTypes.TITLE_ASC}>
          {sortProductsTypes.TITLE_ASC}
        </option>
        <option value={sortProductsTypes.PRICE_DESC}>
          {sortProductsTypes.PRICE_DESC}
        </option>
        <option value={sortProductsTypes.PRICE_ASC}>
          {sortProductsTypes.PRICE_ASC}
        </option>
      </select>
    </div>
  );
}
