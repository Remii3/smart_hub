import { Input } from '@components/UI/input';
import { Label } from '@components/UI/label';
import { useSearchParams } from 'react-router-dom';

interface PropsTypes {
  highestPrice: string;
}

export default function ({ highestPrice }: PropsTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const changePriceRangeHandler = (name: string, value: string) => {
    searchParams.set(name, value);
    setSearchParams(searchParams, { replace: true });
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
            value={searchParams.get('minPrice') || ''}
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
            value={searchParams.get('maxPrice') || ''}
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
