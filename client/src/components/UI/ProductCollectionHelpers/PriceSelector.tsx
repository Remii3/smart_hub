import { ChangeEvent, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

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
  return (
    <div className="flex-grow sm:relative" id={`${category}-PriceSelector`}>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                inline-flex items-center rounded-md  px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary `}
            >
              <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                <span className="text-sm font-medium"> Price </span>

                <ChevronDownIcon
                  className={`${open ? '-rotate-180' : ''}
                  ml-2 h-4 w-4 transition duration-150 ease-in-out`}
                  aria-hidden="true"
                />
              </summary>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 w-full -translate-x-1/2 transform ">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 md:max-w-sm">
                  {/* <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2"> */}
                  <div className="relative bg-white">
                    <div className="bg-white">
                      <header className="flex  flex-wrap justify-between p-4">
                        <span className="text-sm text-gray-700">
                          The highest price is {highestPrice && highestPrice}€
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
                        <div className="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
                          <label className="flex w-full items-center gap-2">
                            <span className="text-sm text-gray-600">€</span>

                            <input
                              id={`${category}-Min-PriceSelector`}
                              type="number"
                              placeholder={`From ${0}`}
                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                              min={0}
                              value={minPrice}
                              onChange={(e) => minPriceChangeHandler(e)}
                            />
                          </label>

                          <label className="flex w-full items-center gap-2">
                            <span className="text-sm text-gray-600">€</span>

                            <input
                              id={`${category}-Max-PriceSelector`}
                              type="number"
                              placeholder={`To ${highestPrice && highestPrice}`}
                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                              value={maxPrice}
                              onChange={(e) => maxPriceChangeHandler(e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      {/* <Popover className="relative">
        <>
          <Popover.Button
            className={`
               `}
          ></Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 -translate-x-10 transform px-4 sm:px-0 lg:max-w-3xl">
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
                          placeholder={`From ${0}`}
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                          min={0}
                          value={minPrice}
                          onChange={(e) => minPriceChangeHandler(e)}
                        />
                      </label>

                      <label className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">$</span>

                        <input
                          id={`${category}-Max-PriceSelector`}
                          type="number"
                          placeholder={`To ${highestPrice}`}
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                          value={maxPrice}
                          onChange={(e) => maxPriceChangeHandler(e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      </Popover> */}
    </div>
  );
}
