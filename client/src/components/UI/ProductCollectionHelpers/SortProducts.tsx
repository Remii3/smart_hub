import { ChangeEvent } from 'react';
import { sortProductsTypes } from '../../../helpers/sortProducts';

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
        <option value={sortProductsTypes.DATE_DESC}>Date, DESC</option>
        <option value={sortProductsTypes.DATE_ASC}>Date, ASC</option>
        <option value={sortProductsTypes.TITLE_DESC}>Title, DESC</option>
        <option value={sortProductsTypes.TITLE_ASC}>Title, ASC</option>
        <option value={sortProductsTypes.PRICE_DESC}>Price, DESC</option>
        <option value={sortProductsTypes.PRICE_ASC}>Price, ASC</option>
      </select>
    </div>
  );
}
