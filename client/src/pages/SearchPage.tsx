import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvancedFilter from '@features/search/AdvancedFilter';
import { UnknownProductTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import AuctionCard from '@components/cards/AuctionCard';
import MainContainer from '@layout/MainContainer';
import Pagination from '@components/paginations/Pagination';
import SortProducts from '@features/productCollections/SortProducts';
import { sortProductsTypes } from '@hooks/useSortProducts';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

interface SearchedProductsDataTypes {
  products: UnknownProductTypes[];
  rawData: {
    author: string;
    category: string;
    phrase: string;
    totalPages: number;
    totalProducts: number;
    highestPrice: number;
  };
}
interface Test {
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
      products: [],
      rawData: {
        author: '',
        category: '',
        phrase: '',
        totalPages: 0,
        totalProducts: 0,
        highestPrice: 0,
      },
    });
  const [sortOption, setSortOption] = useState<string>(
    sortProductsTypes.DATE_DESC
  );

  const [filtersData, setFiltersData] = useState<Test>({
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
  const updatedQuery = searchQuery.search.slice(1);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
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
      products: data.products,
      rawData: data.finalRawData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  };

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
            highestPrice={searchedProductsData.rawData.highestPrice}
          />
        </aside>
        <section className="w-full space-y-2">
          <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5">
            {searchedProductsData.rawData?.category && (
              <li>
                <button
                  name="category"
                  type="button"
                  onClick={(e) => removeQueryHandler(e)}
                >
                  <span>Category: {searchedProductsData.rawData.category}</span>
                  <span>X</span>
                </button>
              </li>
            )}
            {searchedProductsData.rawData?.phrase && (
              <li>
                <button
                  name="phrase"
                  type="button"
                  onClick={(e) => removeQueryHandler(e)}
                >
                  <span> Phrase: {searchedProductsData.rawData.phrase}</span>
                  <span>X</span>
                </button>
              </li>
            )}
          </ul>
          {searchedProductsData.products &&
          searchedProductsData.products.length > 0 ? (
            <div>
              <div className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchedProductsData.products.map((item) => {
                  return item.market_place === 'Shop' ? (
                    <ShopCard
                      key={item._id}
                      _id={item._id}
                      price={item.shop_info.price}
                      productQuantity={item.quantity}
                      title={item.title}
                      authors={item.authors}
                      description={item.description}
                      img={item.img}
                    />
                  ) : (
                    <AuctionCard
                      key={item._id}
                      _id={item._id}
                      title={item.title}
                      authors={item.authors}
                      description={item.description}
                      img={item.img}
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
          ) : (
            <p className="flex h-full w-full items-center justify-center">
              No products found.
            </p>
          )}
        </section>
      </div>
    </MainContainer>
  );
}
