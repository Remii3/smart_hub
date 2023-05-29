import { ChangeEvent, useState } from 'react';

type PropsTypes = {
  highestPrice: number;
  category: string;
};

function PriceSelector({ highestPrice, category }: PropsTypes) {
  const [lowPrice, setLowPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const resetPriceRange = () => {
    setLowPrice('');
    setHighPrice('');
  };

  const lowPriceChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLowPrice(e.target.value);
  };

  const highPriceChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setHighPrice(e.target.value);
  };

  return (
    <div className="relative" id={`${category}-PriceSelector`}>
      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
          <span className="text-sm font-medium"> Price </span>

          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </summary>

        <div className="z-50 group-open:absolute group-open:top-auto group-open:mt-2 ltr:group-open:start-0">
          <div className="w-96 rounded border border-gray-200 bg-white">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">
                The highest price is {highestPrice}
              </span>

              <button
                type="button"
                className="text-sm text-gray-900 underline underline-offset-4"
                onClick={() => resetPriceRange()}
              >
                Reset
              </button>
            </header>

            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">$</span>

                  <input
                    id={`${category}-Min-PriceSelector`}
                    type="number"
                    placeholder="From"
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    value={lowPrice}
                    onChange={(e) => lowPriceChangeHandler(e)}
                  />
                </label>

                <label className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">$</span>

                  <input
                    id={`${category}-Max-PriceSelector`}
                    type="number"
                    placeholder="To"
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    value={highPrice}
                    onChange={(e) => highPriceChangeHandler(e)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

export default PriceSelector;
