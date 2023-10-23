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
  };
  isLoading: boolean;
}
export enum SearchActionKind {
  CHANGE_SELECTED_MARKETPLACE = 'CHANGE_SELECTED_MARKETPLACE',
  CHANGE_SELECTED_PRICE_RANGE = 'CHANGE_SELECTED_PRICE_RANGE',
  CHANGE_SELECTED_RATING = 'CHANGE_SELECTED_RATING',
  RESET_SELECT_RATING = 'RESET_SELECT_RATING',
  RESET_SELECT_PRICE_RANGE = 'RESET_SELECT_PRICE_RANGE',
  RESET_SELECTED_MARKETPLACE = 'RESET_SELECTED_MARKETPLACE',
}
export interface SearchActions {
  type: SearchActionKind;
  payload?: any;
}
export interface SearchState {
  marketplace: {
    name: string;
    isChecked: boolean;
  }[];
  selectedPriceRange: {
    maxPrice: string | number;
    minPrice: string | number;
  };
  selectedRating: number;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useLocation();

  const pageIteration = 5;

  const initialSearchState = {
    marketplace: [
      {
        name: 'shop',
        isChecked: true,
      },
      {
        name: 'collection',
        isChecked: false,
      },
    ],
    selectedPriceRange: {
      minPrice: '',
      maxPrice: '',
    },
    selectedRating: 5,
  } as SearchState;

  const searchReducer = (state: SearchState, action: SearchActions) => {
    const { type, payload } = action;

    switch (type) {
      case SearchActionKind.CHANGE_SELECTED_MARKETPLACE: {
        return {
          ...state,
          marketplace: [
            ...state.marketplace.map((el) =>
              el.name === payload.name
                ? { ...el, isChecked: payload.state }
                : el
            ),
          ],
        };
      }
      case SearchActionKind.CHANGE_SELECTED_PRICE_RANGE: {
        return {
          ...state,
          selectedPriceRange: {
            ...state.selectedPriceRange,
            [payload.name]: payload.value,
          },
        };
      }
      case SearchActionKind.CHANGE_SELECTED_RATING: {
        return {
          ...state,
          selectedRating: payload,
        };
      }
      case SearchActionKind.RESET_SELECTED_MARKETPLACE:
        return {
          ...state,
          marketplace: [
            {
              name: 'shop',
              isChecked: true,
            },
            {
              name: 'collection',
              isChecked: false,
            },
          ],
        };
      case SearchActionKind.RESET_SELECT_PRICE_RANGE:
        return { ...state, selectedPriceRange: { minPrice: '', maxPrice: '' } };
      case SearchActionKind.RESET_SELECT_RATING:
        return {
          ...state,
          selectedRating: 5,
        };
      default:
        return { ...state };
    }
  };
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);

  const [searchedProductsData, setSearchedProductsData] =
    useState<SearchedProductsDataTypes>({
      products: null,
      rawData: {
        queries: null,
        author: '',
        totalPages: 0,
        totalProducts: 0,
        highestPrice: 0,
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
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_SEARCHED,
      params: {
        phrase: updatedQuery,
        page: searchParams.get('page'),
        pageSize: pageIteration,
        filtersData: searchState,
        sortOption: searchParams.get('sortMethod'),
      },
    });
    setSearchedProductsData({
      products: (data && data.products) || [],
      rawData: data && data.finalRawData,
      isLoading: false,
    });
  }, [updatedQuery, searchParams, searchState]);

  const removeQueryHandler = (e: any) => {
    const currentQueryParams = new URLSearchParams(searchQuery.search);
    currentQueryParams.delete(e.currentTarget.name);
    navigate({
      pathname: '/search',
      search: currentQueryParams.toString(),
    });
  };

  const changeCurrentPageHandler = (newPageNumber: number) => {
    setSearchParams((prevState) => {
      return {
        ...prevState,
        page: newPageNumber,
        sortMethod: searchParams.get('sortMethod'),
      };
    });
  };

  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = sortOptionsArray.find((item) => {
      return item.value === e.target.value;
    });
    if (selectedSortOption) {
      setSearchParams((prevState) => {
        return {
          ...prevState,
          sortMethod: selectedSortOption.value,
          page: 1,
        };
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!defaultSearch) {
      window.history.replaceState(null, '', 'hello');

      // setSearchParams((prevState) => {
      //   if (searchParams.get('category')) {
      //     return {
      //       ...prevState,
      //       page: searchParams.get('page') || 1,
      //       sortMethod: sortOptions.DATE_DESC,
      //       category: searchParams.get('category'),
      //     };
      //   } else {
      //     return {
      //       ...prevState,
      //       page: searchParams.get('page') || 1,
      //       sortMethod: sortOptions.DATE_DESC,
      //     };
      //   }
      // });
    }
  }, [window.location.search]);
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
            sortOption={searchParams.get('sortMethod')}
            sortOptionChangeHandler={sortOptionChangeHandler}
          />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <AdvancedFilter
          searchState={searchState}
          dispatch={dispatch}
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
                  currentPage={Number(searchParams.get('page'))}
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
