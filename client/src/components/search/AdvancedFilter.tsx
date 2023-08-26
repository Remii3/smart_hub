// import TertiaryBtn from '../UI/Btns/TertiaryBtn';
import { Button } from '../UI/Btns/Button';
import MarketplaceSelector from './MarketplaceSelector';

type AdvancedFilterTypes = {
  highestPrice: number;
  filtersData: {
    marketplace: {
      name: string;
      isChecked: boolean;
    }[];
    price: {
      maxPrice: string | number;
      minPrice: string | number;
    };
  };
  onSelectMarketplace: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMarketplaceReset: () => void;
  onPriceReset: () => void;
};

export default function AdvancedFilter({
  filtersData,
  onSelectMarketplace,
  onPriceChange,
  onMarketplaceReset,
  onPriceReset,
  highestPrice,
}: AdvancedFilterTypes) {
  const { marketplace, price } = filtersData;

  const clearAllSelectors = () => {
    onMarketplaceReset();
    onPriceReset();
  };

  return (
    <div className="sticky top-20">
      <div>
        <p>Advanced filter</p>
        <Button
          variant="tertiary"
          size="default"
          onClick={() => clearAllSelectors()}
        >
          Clear all
        </Button>
      </div>
      <div>
        <div>
          <h6>Type of offer</h6>
          <Button
            variant="tertiary"
            size="default"
            onClick={onMarketplaceReset}
          >
            Clear
          </Button>
        </div>
        <MarketplaceSelector
          options={marketplace}
          selectMarketplace={onSelectMarketplace}
        />
      </div>
      <div>
        {/* <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2"> */}
        <div className="relative bg-white">
          <div className="bg-white">
            <Button variant="tertiary" size="default" onClick={onPriceReset}>
              Clear
            </Button>

            <div className="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
              <div className="w-full ">
                <p>Min</p>
                <label className="flex w-full items-center gap-2">
                  <span className="text-sm text-gray-600">€</span>
                  <input
                    id="search-Min-PriceSelector"
                    type="number"
                    name="minPrice"
                    placeholder={`From ${1}`}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    min={1}
                    value={price.minPrice}
                    onChange={(e) => onPriceChange(e)}
                  />
                </label>
              </div>
              <div className="w-full">
                <p>Max </p>
                <label className="flex w-full items-center gap-2">
                  <span className="text-sm text-gray-600">€</span>

                  <input
                    id="search-Max-PriceSelector"
                    type="number"
                    name="maxPrice"
                    placeholder={`To ${highestPrice}`}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    value={price.maxPrice}
                    min={1}
                    max={highestPrice}
                    onChange={(e) => onPriceChange(e)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{/* Add price filter */}</div>
      <div>{/* Add star filter */}</div>
    </div>
  );
}
