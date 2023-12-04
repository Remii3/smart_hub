import { Button } from '@components/UI/button';
import MarketplaceSelector from './MarketplaceSelector';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { useSearchParams } from 'react-router-dom';
import CategoriesFilter from './CategoriesFilter';
import AuthorsFilter from './AuthorsFilter';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/UI/collapsible';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { CategoryTypes } from '@customTypes/interfaces';

type AdvancedFilterTypes = {
  highestPrice: number;
  categoriesState: CategoryTypes[];
  openCollapsible: boolean;
};

export default function AdvancedFilter({
  highestPrice,
  categoriesState,
  openCollapsible,
}: AdvancedFilterTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const clearSelectedMarketplace = () => {
    searchParams.delete('marketplace');
    searchParams.append('marketplace', 'shop');
    searchParams.append('marketplace', 'collection');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedPriceRange = () => {
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedRating = () => {
    searchParams.set('rating', '5');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedCategories = () => {
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedAuthors = () => {
    searchParams.delete('author');
    setSearchParams(searchParams, { replace: true });
  };
  const clearAll = () => {
    clearSelectedMarketplace();
    clearSelectedPriceRange();
    clearSelectedRating();
    clearSelectedCategories();
    clearSelectedAuthors();
  };
  return (
    <>
      <aside
        className={`md:block bg-background z-10 sticky top-[112px] w-full ${
          openCollapsible ? 'block' : 'hidden'
        } md:max-w-[250px]`}
      >
        <section className="mb-4 flex items-center justify-between">
          <strong className="font-semibold">Advanced filter</strong>
          <Button variant="link" onClick={clearAll} size={'clear'}>
            Clear all
          </Button>
        </section>
        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="font-medium">Type of offer</strong>
            <Button
              variant="link"
              size={'clear'}
              onClick={clearSelectedMarketplace}
            >
              Clear
            </Button>
          </div>
          <MarketplaceSelector />
        </section>

        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="font-medium">Price range</strong>
            <Button
              variant="link"
              size={'clear'}
              onClick={clearSelectedPriceRange}
            >
              Clear
            </Button>
          </div>

          <PriceRangeFilter highestPrice={highestPrice.toString()} />
        </section>
        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="font-medium">Rating</strong>
            <Button variant="link" size={'clear'} onClick={clearSelectedRating}>
              Clear
            </Button>
          </div>
          <RatingFilter />
        </section>
        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="font-medium">Categories</strong>
            <Button
              variant="link"
              size={'clear'}
              onClick={clearSelectedCategories}
            >
              Clear
            </Button>
          </div>
          <CategoriesFilter categoriesState={categoriesState} />
        </section>
        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <strong className="font-medium">Authors</strong>
            <Button
              variant="link"
              size={'clear'}
              onClick={clearSelectedAuthors}
            >
              Clear
            </Button>
          </div>
          <AuthorsFilter />
        </section>
      </aside>
    </>
  );
}
