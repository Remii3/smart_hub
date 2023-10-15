import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AdvancedFilter from '@pages/search/AdvancedFilter';
import { UnknownProductTypes } from '@customTypes/interfaces';
import ShopCard, { SkeletonShopCard } from '@components/cards/ShopCard';
import AuctionCard from '@components/cards/AuctionCard';
import MainContainer from '@layout/MainContainer';
import Pagination from '@components/paginations/Pagination';
import SortProducts from '@features/sortProducts/SortProducts';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import {
  SortType,
  sortOptions,
  sortOptionsArray,
} from '@hooks/useSortProducts';
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
interface FilterDataType {
  marketplace: {
    name: string;
    isChecked: boolean;
  }[];
  price: {
    maxPrice: string | number;
    minPrice: string | number;
  };
}
export default function SearchPage() {
  const [pagesData, setPagesData] = useState({
    currentPage: 1,
    pageIteration: 5,
  });
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
  const params = new URLSearchParams(window.location.search);
  const defaultSearch = params.get('sort');

  const [sortOption, setSortOption] = useState<string>(
    defaultSearch || sortOptions.DATE_DESC
  );

  const [filtersData, setFiltersData] = useState<FilterDataType>({
    marketplace: [
      {
        name: 'shop',
        isChecked: true,
      },
      {
        name: 'auction',
        isChecked: true,
      },
    ],
    price: {
      minPrice: '',
      maxPrice: '',
    },
  });

  const searchQuery = useLocation();
  const searchQueryParams = searchQuery.search;
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
        page: pagesData.currentPage,
        pageSize: pagesData.pageIteration,
        filtersData,
        sortOption,
      },
    });

    setSearchedProductsData({
      products: (data && data.products) || [],
      rawData: data && data.finalRawData,
      isLoading: false,
    });
  }, [updatedQuery, pagesData, sortOption, filtersData]);

  const updateSortHandler = (e: SortType) => {
    params.set('sort', e);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const changePriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersData((prevState) => {
      return {
        ...prevState,
        price: {
          ...prevState.price,
          [e.target.name]: Number(e.target.value),
        },
      };
    });
  };

  const selectMarketplaceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersData((prevState) => {
      return {
        ...prevState,
        marketplace: prevState.marketplace.map((el) =>
          el.name === e.target.name ? { ...el, isChecked: !el.isChecked } : el
        ),
      };
    });
  };

  const resetPriceHandler = () => {
    setFiltersData((prevState) => {
      return {
        ...prevState,
        price: {
          maxPrice: '',
          minPrice: '',
        },
      };
    });
  };

  const resetMarketplaceHandler = () => {
    setFiltersData((prevState) => {
      return {
        ...prevState,
        marketplace: prevState.marketplace.map((el) => {
          return { ...el, isChecked: true };
        }),
      };
    });
  };

  const removeQueryHandler = (e: any) => {
    const currentQueryParams = new URLSearchParams(searchQuery.search);
    currentQueryParams.delete(e.currentTarget.name);
    navigate({
      pathname: '/search',
      search: currentQueryParams.toString(),
    });
  };

  const changeCurrentPageHandler = (newPageNumber: number) => {
    setPagesData((prevState) => {
      return { ...prevState, currentPage: newPageNumber };
    });
  };

  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    const selectedSortOption = sortOptionsArray.find((item) => {
      return item.value === e.target.value;
    });
    if (selectedSortOption) {
      updateSortHandler(selectedSortOption.value);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPagesData((prevState) => {
      return { ...prevState, currentPage: 1 };
    });
  }, [sortOption, filtersData]);

  useEffect(() => {
    if (!defaultSearch) {
      updateSortHandler(sortOptions.DATE_DESC);
    }
  }, [window.location.search]);

  return (
    <MainContainer>
      <div className="flex justify-between">
        <p>
          Results:{' '}
          {searchedProductsData.rawData &&
            searchedProductsData.rawData.totalProducts}
        </p>
        <div>
          <SortProducts
            category="search"
            sortOption={sortOption}
            sortOptionChangeHandler={sortOptionChangeHandler}
          />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <aside className="min-w-[150px]">
          <AdvancedFilter
            filtersData={filtersData}
            onSelectMarketplace={selectMarketplaceHandler}
            onPriceChange={changePriceHandler}
            onMarketplaceReset={resetMarketplaceHandler}
            onPriceReset={resetPriceHandler}
            highestPrice={
              (searchedProductsData.rawData &&
                searchedProductsData.rawData.highestPrice) ||
              0
            }
          />
        </aside>
        <section className="w-full space-y-2">
          {searchQueryParams && (
            <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5">
              {searchedProductsData.rawData &&
                searchedProductsData.rawData.queries &&
                searchedProductsData.rawData.queries.map((query) => (
                  <li key={query.key}>
                    <Badge variant={'outline'}>
                      <button
                        name={query.key}
                        type="button"
                        onClick={(e) => removeQueryHandler(e)}
                        className="space-x-2"
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
            <div className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {searchedProductsData.isLoading &&
                [...Array(3)].map((el, index) => (
                  <SkeletonShopCard
                    key={index}
                    height="h-[500px]"
                    width="w-full"
                  />
                ))}

              {!searchedProductsData.isLoading &&
                searchedProductsData.products &&
                searchedProductsData.products.map((item) => {
                  return item.market_place === 'Shop' ? (
                    <ShopCard
                      key={item._id}
                      _id={item._id}
                      price={item.shop_info.price}
                      productQuantity={item.quantity}
                      title={item.title}
                      authors={item.authors}
                      description={item.description}
                      img={item.imgs && item.imgs[0].url}
                      rating={item.rating}
                    />
                  ) : (
                    <AuctionCard
                      key={item._id}
                      _id={item._id}
                      title={item.title}
                      authors={item.authors}
                      description={item.description}
                      img={item.imgs && item.imgs[0].url}
                      auctionEndDate={item.auction_info.auction_end_date}
                      currentPrice={item.auction_info.current_price}
                      startingPrice={item.auction_info.starting_price}
                    />
                  );
                })}
            </div>
            <div className="my-3 flex w-full justify-center">
              {searchedProductsData.rawData && (
                <Pagination
                  currentPage={pagesData.currentPage}
                  totalCount={searchedProductsData.rawData.totalProducts}
                  pageSize={pagesData.pageIteration}
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
