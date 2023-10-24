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
      selectedCategories: searchParams.getAll('category'),
      selectedAuthors: searchParams.getAll('author'),
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

  const removeQueryHandler = (paramValue: any, paramKey: string) => {
    switch (paramKey) {
      case 'category':
        {
          const categories = searchParams
            .getAll('category')
            .filter((item) => item !== paramValue);
          searchParams.delete('category');
          if (categories) {
            categories.forEach((item) => searchParams.append('category', item));
          }
        }
        break;
      case 'author':
        {
          const authors = searchParams
            .getAll('author')
            .filter((item) => item !== paramValue);
          searchParams.delete('author');
          if (authors) {
            authors.forEach((item) => searchParams.append('author', item));
          }
        }
        break;
    }
    setSearchParams(searchParams, { replace: true });
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
        <section className="w-full space-y-1">
          {(searchParams.get('phrase') ||
            searchParams.get('category') ||
            searchParams.get('author')) && (
            <>
              {searchParams.get('phrase') && (
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 py-1">
                  {searchParams.getAll('phrase').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'phrase')}
                          className="space-x-2 px-[10px] py-[1px]"
                        >
                          <span className=" text-sm">{query}</span>
                          <span>X</span>
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              {searchParams.get('author') && (
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 py-1">
                  {searchParams.getAll('author').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-purple-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'author')}
                          className="group relative px-[10px] py-[1px]"
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
                <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5 py-1">
                  {searchParams.getAll('category').map((query) => (
                    <li key={query}>
                      <Badge variant={'outline'} className="bg-green-100 p-0">
                        <button
                          name={query}
                          type="button"
                          onClick={() => removeQueryHandler(query, 'category')}
                          className="group relative px-[10px] py-[1px]"
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
