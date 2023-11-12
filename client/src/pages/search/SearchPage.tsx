import { useState, useEffect, ChangeEvent, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdvancedFilter from '@pages/search/AdvancedFilter';
import { ProductTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import MainContainer from '@layout/MainContainer';
import Pagination from '@components/paginations/Pagination';
import SortProducts from '@features/sortProducts/SortProducts';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { sortOptions, sortOptionsArray } from '@hooks/useSortProducts';
import { Badge } from '@components/UI/badge';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { toast } from '@components/UI/use-toast';
import CollectionCard from '@components/cards/CollectionCard';

interface SearchedProductsDataTypes {
  products: ProductTypes[];
  rawData: {
    queries: {
      phrase: string;
      authors: string[];
      categories: string[];
      page: string;
      marketplace: string[];
      minPrice: string;
      maxPrice: string;
      rating: string;
      special: string;
    } | null;
    totalPages: number;
    totalProducts: number;
    highestPrice: number;
  };
  isLoading: boolean;
}
type FilterParams = 'phrase' | 'category' | 'author' | 'special';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSortMethod = searchParams.get('sortMethod');

  const pageIteration = 8;

  const [searchedProductsData, setSearchedProductsData] =
    useState<SearchedProductsDataTypes>({
      products: [],
      rawData: {
        queries: null,
        totalPages: 0,
        totalProducts: 0,
        highestPrice: 0,
      },
      isLoading: false,
    });

  const fetchData = useCallback(async () => {
    if (!currentSortMethod) return;
    setSearchedProductsData((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const newFilters = {
      marketplace: searchParams.getAll('marketplace'),
      selectedPriceRange: {
        maxPrice: searchParams.get('maxPrice') || '',
        minPrice: searchParams.get('minPrice') || '',
      },
      selectedRating: searchParams.get('rating') || 5,
      selectedCategories: searchParams.getAll('category'),
      selectedAuthors: searchParams.getAll('author'),
      searchedPhrase: searchParams.get('phrase'),
      page: searchParams.get('page'),
      sortOption: searchParams.get('sortMethod'),
      searchedSpecial: searchParams.get('special'),
    };
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_SEARCHED,
      params: {
        pageSize: pageIteration,
        filtersData: newFilters,
        sortOption: newFilters.sortOption,
        strictMarketplace: true,
      },
    });
    if (error) {
      setSearchedProductsData((prevState) => {
        return { ...prevState, isLoading: false };
      });
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'We failed downloading the products',
      });
    }
    setSearchedProductsData({
      products: data.products,
      rawData: data.rawData,
      isLoading: false,
    });
  }, [searchParams]);

  const removeQueryHandler = (paramValue: string, paramKey: FilterParams) => {
    switch (paramKey) {
      case 'phrase': {
        searchParams.delete('phrase');
        setSearchParams(searchParams);
        break;
      }
      case 'special': {
        searchParams.delete('special');
        setSearchParams(searchParams);
        break;
      }
      case 'category': {
        const categories = searchParams
          .getAll('category')
          .filter((item) => item !== paramValue);
        searchParams.delete('category');
        if (categories) {
          categories.forEach((item) => searchParams.append('category', item));
        }
        break;
      }
      case 'author': {
        const authors = searchParams
          .getAll('author')
          .filter((item) => item !== paramValue);
        searchParams.delete('author');
        if (authors) {
          authors.forEach((item) => searchParams.append('author', item));
        }
        break;
      }
      default:
        return;
    }
    setSearchParams(searchParams, { replace: true });
  };

  const ref = useRef(document.getElementById('mainContainer'));
  useEffect(() => {
    if (searchedProductsData.products) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [searchedProductsData.products]);

  const changeCurrentPageHandler = (newPageNumber: number) => {
    searchParams.set('page', `${newPageNumber}`);
    setSearchParams(searchParams);
  };

  const sortOptionChangeHandler = (selectedOption: string) => {
    const selectedSortOption = sortOptionsArray.find((item) => {
      return item.value === selectedOption;
    });
    if (selectedSortOption) {
      searchParams.set('sortMethod', selectedSortOption.value);
      setSearchParams(searchParams, { replace: true });
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (!currentSortMethod) {
      const searchPage = searchParams.get('page');
      const searchMarketplace = searchParams.get('marketplace');
      const searchRating = searchParams.get('rating');
      const searchSortMethod = searchParams.get('sortMethod');

      if (!searchMarketplace) {
        searchParams.set('marketplace', 'shop');
      }

      if (!searchRating) {
        searchParams.set('rating', '5');
      }
      if (!searchPage) {
        searchParams.set('page', '1');
      }
      if (!searchSortMethod) {
        searchParams.set('sortMethod', sortOptions.DATE_DESC);
      }
      setSearchParams(searchParams, { replace: true });
    }
  }, []);
  return (
    <MainContainer>
      <div className="fixed left-0 right-0 top-16 z-10 flex w-full items-center justify-between bg-background px-4 pb-1 pt-2 md:static md:mb-2 md:px-0 md:pt-0">
        <span>
          Results:{' '}
          {searchedProductsData.rawData &&
            searchedProductsData.rawData.totalProducts}
        </span>
        <div>
          <SortProducts
            category="search"
            sortOption={currentSortMethod}
            sortOptionChangeHandler={sortOptionChangeHandler}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <AdvancedFilter
          highestPrice={
            (searchedProductsData.rawData &&
              searchedProductsData.rawData.highestPrice) ||
            0
          }
        />
        <section className="mt-16 h-full w-full space-y-2 md:pt-0">
          {(searchParams.get('phrase') ||
            searchParams.get('special') ||
            searchParams.get('category') ||
            searchParams.get('author')) && (
            <>
              {(searchParams.get('phrase') || searchParams.get('special')) && (
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 px-2 py-1">
                  {searchParams.getAll('special').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-sky-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'special')}
                          className="group relative px-[10px] py-1"
                        >
                          <div className="absolute inset-0 h-full w-full rounded-md bg-black opacity-0 transition-opacity ease-out group-hover:opacity-10" />
                          <span className="text-sm text-sky-700 group-hover:brightness-90">
                            {query}
                          </span>
                          <div className="absolute -left-2 -top-1 box-border h-4 w-4 rounded-full border bg-sky-100 text-sky-600">
                            X
                          </div>
                        </button>
                      </Badge>
                    </li>
                  ))}
                  {searchParams.getAll('phrase').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-sky-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'phrase')}
                          className="group relative px-[10px] py-1"
                        >
                          <div className="absolute inset-0 h-full w-full rounded-md bg-black opacity-0 transition-opacity ease-out group-hover:opacity-10" />
                          <span className="text-sm text-sky-700 group-hover:brightness-90">
                            {query}
                          </span>
                          <div className="absolute -left-2 -top-1 box-border h-4 w-4 rounded-full border bg-sky-100 text-sky-600">
                            X
                          </div>
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              {searchParams.get('author') && (
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 px-2 py-1">
                  {searchParams.getAll('author').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-purple-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'author')}
                          className="group relative px-[10px] py-1"
                        >
                          <div className="absolute inset-0 h-full w-full rounded-md bg-black opacity-0 transition-opacity ease-out group-hover:opacity-10" />
                          <span className="text-sm text-purple-700 group-hover:brightness-90">
                            {query}
                          </span>
                          <div className="absolute -left-2 -top-1 box-border h-4 w-4 rounded-full border bg-purple-100 text-purple-600">
                            X
                          </div>
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              {searchParams.get('category') && (
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 px-2 py-1">
                  {searchParams.getAll('category').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-green-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'category')}
                          className="group relative px-[10px] py-1"
                        >
                          <div className="absolute inset-0 h-full w-full rounded-md bg-black opacity-0 transition-opacity ease-out group-hover:opacity-10" />
                          <span className="text-sm text-green-700 group-hover:brightness-90">
                            {query}
                          </span>
                          <div className="absolute -left-2 -top-1 box-border h-4 w-4 rounded-full border bg-green-100 text-green-600">
                            X
                          </div>
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {!searchedProductsData.isLoading &&
            searchedProductsData.products &&
            searchedProductsData.products.length === 0 && (
              <div className="flex h-full w-full items-center justify-center">
                No products
              </div>
            )}
          <div className="relative h-full">
            <div className="relative grid min-h-[400px] grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {searchedProductsData.isLoading && <LoadingCircle />}
              {!searchedProductsData.isLoading &&
                searchedProductsData.products &&
                searchedProductsData.products.map((item) => {
                  return (
                    item.marketplace === 'shop' && (
                      <ShopCard
                        key={item._id}
                        _id={item._id}
                        price={item.price.value}
                        productQuantity={item.quantity}
                        title={item.title}
                        authors={item.authors}
                        description={item.description}
                        img={
                          item.imgs && item.imgs.length > 0
                            ? item.imgs[0].url
                            : null
                        }
                        rating={item.rating.avgRating}
                      />
                    )
                  );
                })}
              {!searchedProductsData.isLoading &&
                searchedProductsData.products &&
                searchedProductsData.products.map((item) => {
                  return (
                    item.marketplace === 'collection' && (
                      <CollectionCard
                        key={item._id}
                        _id={item._id}
                        price={item.price}
                        title={item.title}
                        rating={item.rating}
                        imgs={item.imgs}
                        shortDescription={item.shortDescription}
                      />
                    )
                  );
                })}
            </div>
            <div className="my-3 flex w-full justify-center">
              {searchedProductsData.rawData && (
                <Pagination
                  currentPage={Number(searchParams.get('page')) || 1}
                  totalCount={searchedProductsData.rawData.totalProducts}
                  pageSize={pageIteration}
                  onPageChange={(newPageNumber: number) =>
                    changeCurrentPageHandler(newPageNumber)
                  }
                  siblingCount={1}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </MainContainer>
  );
}
