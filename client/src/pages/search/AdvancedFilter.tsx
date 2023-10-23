import { Button } from '@components/UI/button';
import MarketplaceSelector from './MarketplaceSelector';
import { Input } from '@components/UI/input';
import { Label } from '@components/UI/label';
import RatingFilter from './RatingFilter';
import { SearchActionKind, SearchActions, SearchState } from './SearchPage';
import PriceRangeFilter from './PriceRangeFilter';

type AdvancedFilterTypes = {
  searchState: SearchState;
  dispatch: (e: SearchActions) => void;
  highestPrice: number;
};

export default function AdvancedFilter({
  searchState,
  dispatch,
  highestPrice,
}: AdvancedFilterTypes) {
  const clearSelectedMarketplace = () => {
    dispatch({ type: SearchActionKind.RESET_SELECTED_MARKETPLACE });
  };
  const clearSelectedPriceRange = () => {
    dispatch({ type: SearchActionKind.RESET_SELECT_PRICE_RANGE });
  };
  const clearSelectedSearch = () => {
    dispatch({ type: SearchActionKind.RESET_SELECT_RATING });
  };
  const clearAll = () => {
    clearSelectedMarketplace();
    clearSelectedPriceRange();
    clearSelectedSearch();
  };
  return (
    <aside className="sticky top-20 w-full md:max-w-[250px]">
      <section className="mb-2 flex items-center justify-between">
        <p className="inline-block font-semibold">Advanced filter</p>
        <Button variant="link" onClick={clearAll}>
          Clear all
        </Button>
      </section>
      <section className="mb-1">
        <div className="flex items-center justify-between">
          <p className="inline-block font-medium">Type of offer</p>
          <Button variant="link" onClick={clearSelectedMarketplace}>
            Clear
          </Button>
        </div>
        <MarketplaceSelector
          options={searchState.marketplace}
          dispatch={dispatch}
        />
      </section>
      <section className="mb-1">
        <div className="flex items-center justify-between">
          <p className="inline-block font-medium">Price range</p>
          <Button variant="link" onClick={clearSelectedPriceRange}>
            Clear
          </Button>
        </div>

        <PriceRangeFilter
          dispatch={dispatch}
          highestPrice={highestPrice.toString()}
          selectedPriceRange={searchState.selectedPriceRange}
        />
      </section>
      <section className="mb-1">
        <div className="flex items-center justify-between">
          <p className="inline-block font-medium">Rating</p>
          <Button variant="link" onClick={clearSelectedSearch}>
            Clear
          </Button>
        </div>
        <RatingFilter
          selectedRating={searchState.selectedRating}
          dispatch={dispatch}
        />
      </section>
    </aside>
  );
}
