import {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useReducer,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AdvancedFilter from '@pages/search/AdvancedFilter';
import { UnknownProductTypes } from '@customTypes/interfaces';
import ShopCard, { SkeletonShopCard } from '@components/cards/ShopCard';
import MainContainer from '@layout/MainContainer';
import Pagination from '@components/paginations/Pagination';
import SortProducts from '@features/sortProducts/SortProducts';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { sortOptions, sortOptionsArray } from '@hooks/useSortProducts';
import { Badge } from '@components/UI/badge';

interface SearchedProductsDataTypes {
  products: UnknownProductTypes[] | null;
  rawData: {
    queries: [{ key: 'author' | 'category' | 'special'; value: string }] | null;
    author: string;
    totalPages: number;
    totalProducts: number;
    highestPrice: number;
    newCurrentPage: number;
  };
  isLoading: boolean;
}

export default function SearchPage() {
  const urlParams = new URLSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchPhrase = searchParams.get('phrase') || null;
  const searchCategory = searchParams.get('category') || null;
  const searchAuthor = searchParams.get('author') || null;
  const searchPage = searchParams.get('page') || 1;
  const searchSortMethod =
    searchParams.get('sortMethod') || sortOptions.DATE_DESC;

  const searchQuery = useLocation();
  const pageIteration = 5;

  const [searchedProductsData, setSearchedProductsData] =
    useState<SearchedProductsDataTypes>({
      products: null,
      rawData: {
        queries: null,
        author: '',
        totalPages: 0,
        totalProducts: 0,
        highestPrice: 0,
        newCurrentPage: Number(searchPage),
      },
      isLoading: false,
    });
  const defaultSearch = searchParams.get('sortMethod');
  const updatedQuery = searchQuery.search.slice(1);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
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
    };
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_SEARCHED,
      params: {
        phrase: updatedQuery,
        page: searchPage,
        pageSize: pageIteration,
        filtersData: newFilters,
        sortOption: searchSortMethod,
      },
    });

    setSearchedProductsData({
      products: (data && data.products) || [],
      rawData: data && data.finalRawData,
      isLoading: false,
    });
  }, [updatedQuery, searchParams]);

  const removeQueryHandler = (e: any) => {
    const currentQueryParams = new URLSearchParams(searchQuery.search);
    currentQueryParams.delete(e.currentTarget.name);
    navigate({
      pathname: '/search',
      search: currentQueryParams.toString(),
    });
  };

  const changeCurrentPageHandler = (newPageNumber: number) => {
    searchParams.set('page', `${newPageNumber}`);
    setSearchParams(searchParams);
  };

  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = sortOptionsArray.find((item) => {
      return item.value === e.target.value;
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
    if (!defaultSearch) {
      const newUrl = window.location;
      let preparedUrl = `${newUrl.origin}${newUrl.pathname}?`;

      if (searchCategory) {
        urlParams.set('category', `${searchCategory}`);
        searchParams.set('category', `${searchCategory}`);
      }
      if (searchPhrase) {
        urlParams.set('phrase', `${searchPhrase}`);
      }
      if (searchAuthor) {
        urlParams.set('author', `${searchAuthor}`);
      }
      searchParams.set('marketplace', `shop`);
      urlParams.set('marketplace', `shop`);

      searchParams.set('maxPrice', ``);
      urlParams.set('maxPrice', ``);

      searchParams.set('minPrice', ``);
      urlParams.set('minPrice', ``);

      searchParams.set('rating', `5`);
      urlParams.set('rating', `5`);
      searchParams.set('page', `${searchPage}`);
      urlParams.set('page', `${searchPage}`);
      searchParams.set('sortMethod', `${searchSortMethod}`);
      urlParams.set('sortMethod', `${searchSortMethod}`);
      setSearchParams(searchParams, { replace: true });
      window.history.replaceState(null, '', preparedUrl + urlParams);
    }
  }, []);
  return (
    <MainContainer>
      <div className="mb-2 flex justify-between">
        <p>
          Results:{' '}
          {searchedProductsData.rawData &&
            searchedProductsData.rawData.totalProducts}
        </p>
        <div>
          <SortProducts
            category="search"
            sortOption={searchSortMethod}
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
        <section className="w-full space-y-2">
          {(searchParams.get('phrase') ||
            searchParams.get('category') ||
            searchParams.get('author')) && (
            <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 py-1">
              {searchedProductsData.rawData &&
                searchedProductsData.rawData.queries &&
                searchedProductsData.rawData.queries.map((query) => (
                  <li key={query.key}>
                    <Badge variant={'outline'} className="p-0">
                      <button
                        name={query.key}
                        type="button"
                        onClick={(e) => removeQueryHandler(e)}
                        className="space-x-2 px-[10px] py-[1px]"
                      >
                        <span className=" text-sm">{query.value}</span>
                        <span>X</span>
                      </button>
                    </Badge>
                  </li>
                ))}
            </ul>
          )}

          {!searchedProductsData.isLoading &&
            searchedProductsData.products &&
            searchedProductsData.products.length === 0 && (
              <div className="flex h-full w-full items-center justify-center">
                No products
              </div>
            )}
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchedProductsData.isLoading &&
                [...Array(5)].map((el, index) => (
                  <SkeletonShopCard
                    key={index}
                    height="h-[300px]"
                    width="w-full"
                  />
                ))}

              {!searchedProductsData.isLoading &&
                searchedProductsData.products &&
                searchedProductsData.products.map((item) => {
                  return (
                    item.market_place === 'Shop' && (
                      <ShopCard
                        key={item._id}
                        _id={item._id}
                        price={item.shop_info.price}
                        productQuantity={item.quantity}
                        title={item.title}
                        authors={item.authors}
                        description={item.description}
                        img={
                          item.imgs && item.imgs.length > 0
                            ? item.imgs[0].url
                            : null
                        }
                        rating={item.rating}
                      />
                    )
                  );
                })}
            </div>
            <div className="my-3 flex w-full justify-center">
              {searchedProductsData.rawData && (
                <Pagination
                  currentPage={Number(searchPage)}
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
