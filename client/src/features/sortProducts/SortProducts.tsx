import { ChangeEvent } from 'react';
import { sortOptionsArray } from '@hooks/useSortProducts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/UI/select';

type SortProductsPropsTypes = {
  category: string;
  sortOption: string | null;
  sortOptionChangeHandler: (selectedOption: string) => void;
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
      <Select onValueChange={(e) => sortOptionChangeHandler(e)}>
        <SelectTrigger aria-label="Select sort option">
          <SelectValue placeholder={sortOption} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptionsArray.map((option) => (
              <SelectItem key={option.key} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
