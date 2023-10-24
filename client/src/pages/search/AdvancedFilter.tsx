import { Button } from '@components/UI/button';
import MarketplaceSelector from './MarketplaceSelector';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { useSearchParams } from 'react-router-dom';
import CategoriesFilter from './CategoriesFilter';
import AuthorsFilter from './AuthorsFilter';

type AdvancedFilterTypes = {
  highestPrice: number;
};

export default function AdvancedFilter({ highestPrice }: AdvancedFilterTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const clearSelectedMarketplace = () => {
    searchParams.set('marketplace', 'shop');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedPriceRange = () => {
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    setSearchParams(searchParams, { replace: true });
  };
  const clearSelectedRating = () => {
    searchParams.delete('rating');
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
  );
}
