import { Input } from '@components/UI/input';
import { Label } from '@components/UI/label';
import { SearchActionKind, SearchActions } from './SearchPage';

interface PropsTypes {
  selectedPriceRange: { minPrice: string | number; maxPrice: string | number };
  dispatch: (e: SearchActions) => void;
  highestPrice: string;
}

export default function ({
  selectedPriceRange,
  dispatch,
  highestPrice,
}: PropsTypes) {
  const changePriceRangeHandler = (name: string, value: string) => {
    dispatch({
      type: SearchActionKind.CHANGE_SELECTED_PRICE_RANGE,
      payload: { name, value },
    });
  };
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-nowrap">
      <fieldset>
        <Label className="font-normal">Min</Label>
        <div className="flex flex-row rounded-md shadow">
          <span className="flex items-center rounded-md rounded-r-none border border-input px-3 text-foreground">
            $
          </span>
          <Input
            id="search-Min-PriceSelector"
            name="minPrice"
            className="rounded-l-none shadow-none"
            placeholder="0.00"
            step="0.01"
            type="number"
            value={selectedPriceRange.minPrice}
            onBlur={(e) => {
              if (e.target.value.trim().length > 0) {
                e.target.value = e.target.value
                  ? parseFloat(e.target.value).toFixed(2)
                  : 0;
              }
            }}
            onKeyDown={(e) => {
              if (['.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              changePriceRangeHandler(e.target.name, e.target.value)
            }
          />
        </div>
      </fieldset>
      <fieldset>
        <Label className="font-normal">Max</Label>
        <div className="flex flex-row rounded-md shadow">
          <span className="flex items-center rounded-md rounded-r-none border border-input px-3 text-foreground">
            $
          </span>
          <Input
            id="search-Max-PriceSelector"
            name="maxPrice"
            className="rounded-l-none shadow-none"
            placeholder={`${parseFloat(highestPrice).toFixed(2)}`}
            max={highestPrice}
            step="0.01"
            type="number"
            value={selectedPriceRange.maxPrice}
            onBlur={(e) => {
              if (e.target.value.trim().length > 0) {
                e.target.value = e.target.value
                  ? parseFloat(e.target.value).toFixed(2)
                  : 0;
              }
            }}
            onKeyDown={(e) => {
              if (['.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              changePriceRangeHandler(e.target.name, e.target.value)
            }
          />
        </div>
      </fieldset>
    </div>
  );
}
