import { Link } from 'react-router-dom';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FetchDataTypes, UnknownProductTypes } from '@customTypes/interfaces';
import PriceSelector from './PriceSelector';
import SortProducts from '../../features/sortProducts/SortProducts';
import {
  SortType,
  sortOptions,
  sortOptionsArray,
} from '@hooks/useSortProducts';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import SushiSwiper from '@components/swiper/SushiSwiper';
import errorToast from '@components/UI/error/errorToast';

type PropsTypes = {
  title: string;
  subTitle?: string | null;
  showMore?: boolean;
  category: string;
};

const defaultProps = {
  showMore: false,
  subTitle: null,
};

interface ProductsTypes extends FetchDataTypes {
  data: null | UnknownProductTypes[];
  rawData: null | any;
}

export default function BasicShopWidget({
  title,
  subTitle,
  showMore,
  category,
}: PropsTypes) {
  const [selectedSortOption, setSelectedSortOption] = useState<SortType>(
    sortOptions.DATE_DESC
  );
  const [minPrice, setMinPrice] = useState<string | number>('');
  const [maxPrice, setMaxPrice] = useState<string | number>('');
  const [products, setProducts] = useState<ProductsTypes>({
    data: null,
    rawData: null,
    hasError: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setProducts((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_SHOP_ALL,
      params: {
        category,
        minPrice,
        maxPrice,
        sortOption: selectedSortOption,
      },
    });
    if (error) {
      errorToast(error);
      return setProducts((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setProducts({
      data: data.data,
      rawData: data.rawData,
      isLoading: false,
      hasError: null,
    });
  }, [minPrice, maxPrice, selectedSortOption]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedSortOption = sortOptionsArray.find(
      (sortOption) => sortOption.value === selectedValue
    );
    if (selectedSortOption) {
      setSelectedSortOption(selectedSortOption.value);
    }
  };

  const resetPriceRange = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const minPriceChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(e.target.value));
  };

  const maxPriceChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  return (
    <section className="mb-4">
      <header className="mb-8">
        <h2 className="inline-block text-xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {showMore && (
          <Link
            to={{ pathname: '/search', search: `category=${category}` }}
            className="pl-4 text-sm"
          >
            Show more
          </Link>
        )}
        {subTitle && <p className="mt-4 max-w-md text-slate-500">{subTitle}</p>}
      </header>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-grow gap-4">
          <PriceSelector
            highestPrice={products.rawData ? products.rawData.highestPrice : 0}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            maxPriceChangeHandler={maxPriceChangeHandler}
            minPriceChangeHandler={minPriceChangeHandler}
            resetPriceRange={resetPriceRange}
          />
        </div>
        <div className="block">
          <SortProducts
            category={category}
            sortOption={selectedSortOption}
            sortOptionChangeHandler={sortOptionChangeHandler}
          />
        </div>
      </div>

      <SushiSwiper
        swiperCategory={category}
        itemsType="Shop"
        arrayOfItems={products.data}
        loadingState={products.isLoading}
        errorState={products.hasError}
      />
    </section>
  );
}

BasicShopWidget.defaultProps = defaultProps;
