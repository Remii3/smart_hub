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
import { Label } from '@components/UI/label';

type AdvancedFilterTypes = {
  highestPrice: number;
};

export default function AdvancedFilter({ highestPrice }: AdvancedFilterTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openCollapsible, setOpenCollapsible] = useState(false);
  const clearSelectedMarketplace = () => {
    searchParams.delete('marketplace');
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
      <aside className="sticky top-20 hidden w-full md:block md:max-w-[250px]">
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
          <MarketplaceSelector />
        </section>
        <section className="mb-1">
          <div className="flex items-center justify-between">
            <p className="inline-block font-medium">Price range</p>
            <Button variant="link" onClick={clearSelectedPriceRange}>
              Clear
            </Button>
          </div>

          <PriceRangeFilter highestPrice={highestPrice.toString()} />
        </section>
        <section className="mb-1">
          <div className="flex items-center justify-between">
            <p className="inline-block font-medium">Rating</p>
            <Button variant="link" onClick={clearSelectedRating}>
              Clear
            </Button>
          </div>
          <RatingFilter />
        </section>
        <section className="mb-1">
          <div className="flex items-center justify-between">
            <p className="inline-block font-medium">Categories</p>
            <Button variant="link" onClick={clearSelectedCategories}>
              Clear
            </Button>
          </div>
          <CategoriesFilter />
        </section>
        <section className="mb-1">
          <div className="flex items-center justify-between">
            <p className="inline-block font-medium">Authors</p>
            <Button variant="link" onClick={clearSelectedAuthors}>
              Clear
            </Button>
          </div>
          <AuthorsFilter />
        </section>
      </aside>
      <Collapsible
        className={`${
          openCollapsible && ''
        } fixed left-0 top-[calc(64px+48px)] z-10 block w-full bg-background px-4 py-2 md:hidden`}
        open={openCollapsible}
        onOpenChange={setOpenCollapsible}
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex w-full justify-between">
            <p className="inline-block font-semibold">Advanced filter</p>
            <AdjustmentsHorizontalIcon
              className={`h-6 w-6 transition ${
                openCollapsible ? 'rotate-90' : 'rotate-0'
              }`}
            />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form
            className={`${
              openCollapsible && 'h-[calc(100vh-64px-48px-8px-42px)]'
            } overflow-y-auto pb-4`}
          >
            <section className="mb-2 flex items-center justify-end">
              <Button type="button" variant="link" onClick={clearAll}>
                Clear all
              </Button>
            </section>
            <section className="mb-1">
              <div className="flex items-center justify-between">
                <p className="inline-block font-medium">Type of offer</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={clearSelectedMarketplace}
                >
                  Clear
                </Button>
              </div>
              <MarketplaceSelector />
            </section>
            <section className="mb-1">
              <div className="flex items-center justify-between">
                <p className="inline-block font-medium">Price range</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={clearSelectedPriceRange}
                >
                  Clear
                </Button>
              </div>

              <PriceRangeFilter highestPrice={highestPrice.toString()} />
            </section>
            <section className="mb-1">
              <div className="flex items-center justify-between">
                <p className="inline-block font-medium">Rating</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={clearSelectedRating}
                >
                  Clear
                </Button>
              </div>
              <RatingFilter />
            </section>
            <section className="mb-1">
              <div className="flex items-center justify-between">
                <p className="inline-block font-medium">Categories</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={clearSelectedCategories}
                >
                  Clear
                </Button>
              </div>
              <CategoriesFilter />
            </section>
            <section className="mb-1">
              <div className="flex items-center justify-between">
                <p className="inline-block font-medium">Authors</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={clearSelectedAuthors}
                >
                  Clear
                </Button>
              </div>
              <AuthorsFilter />
            </section>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
