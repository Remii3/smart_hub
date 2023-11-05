import { ChangeEvent, Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/UI/popover';
import { Input } from '@components/UI/input';
import { Label } from '@components/UI/label';
import useCashFormatter from '@hooks/useCashFormatter';

type PriceSelectorPropsTypes = {
  highestPrice: number;
  category: string;
  minPrice: string | number;
  maxPrice: string | number;
  resetPriceRange: () => void;
  minPriceChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  maxPriceChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function PriceSelector({
  highestPrice,
  category,
  minPrice,
  maxPrice,
  resetPriceRange,
  minPriceChangeHandler,
  maxPriceChangeHandler,
}: PriceSelectorPropsTypes) {
  const [popoverOpenState, setPopoverOpenState] = useState(false);
  return (
    <div className="flex-grow sm:relative" id={`${category}-PriceSelector`}>
      <Popover open={popoverOpenState}>
        <PopoverTrigger
          onClick={() => setPopoverOpenState((prevState) => !prevState)}
          className="rounded-md"
        >
          <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 px-2 pb-1 text-gray-900 transition hover:border-gray-600">
            <span className="text-sm font-medium">Price</span>

            <ChevronDownIcon
              className={`${popoverOpenState ? 'rotate-180' : 'rotate-0'}
                  ml-2 h-4 w-4 transition duration-150 ease-in-out`}
              aria-hidden="true"
            />
          </summary>
        </PopoverTrigger>
        <PopoverContent className="relative bg-background">
          <div>
            <div className="bg-background">
              <header className="flex flex-wrap justify-between px-2 py-4">
                <span className="text-sm text-gray-700">
                  The highest price is {highestPrice && highestPrice}
                </span>

                <button
                  type="button"
                  className="text-sm text-gray-900 underline underline-offset-4"
                  onClick={() => resetPriceRange()}
                >
                  Reset
                </button>
              </header>

              <div className="border-t border-gray-200 px-2 py-4">
                <div className="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
                  <fieldset>
                    <Label className="font-normal">Min</Label>
                    <div className="flex flex-row rounded-md shadow">
                      <span className="flex items-center rounded-md rounded-r-none border border-input px-3 text-foreground">
                        $
                      </span>
                      <Input
                        id={`${category}-Min-PriceSelector`}
                        name="minPrice"
                        className="rounded-l-none shadow-none"
                        placeholder={useCashFormatter({ number: 0 })}
                        step="0.01"
                        type="number"
                        value={minPrice}
                        onChange={(e) => minPriceChangeHandler(e)}
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
                        placeholder={`${highestPrice}`}
                        max={highestPrice}
                        step="0.01"
                        type="number"
                        value={maxPrice}
                        onKeyDown={(e) => {
                          if (['.'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => maxPriceChangeHandler(e)}
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
