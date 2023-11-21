import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { CollectionCardTypes, FetchDataTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import CollectionCard from '@components/cards/CollectionCard';
import { Link } from 'react-router-dom';
import PriceSelector from '@pages/shop/PriceSelector';
import SortProducts from '@features/sortProducts/SortProducts';
import {
  SortType,
  sortOptions,
  sortOptionsArray,
} from '@hooks/useSortProducts';
import SushiSwiper from '@components/swiper/SushiSwiper';

interface CollectionsTypes extends FetchDataTypes {
  data: null | CollectionCardTypes[];
  rawData: any;
}
interface PropsTypes {
  title: string;
  subtitle?: string;
  showMore?: boolean;
  category: string;
}
const defaultProps = {
  showMore: false,
  subtitle: null,
};
export default function BasicCollectionWidget({
  title,
  subtitle,
  showMore,
  category,
}: PropsTypes) {
  const [selectedSortOption, setSelectedSortOption] = useState<SortType>(
    sortOptions.DATE_DESC
  );
  const [minPrice, setMinPrice] = useState<string | number>('');
  const [maxPrice, setMaxPrice] = useState<string | number>('');
  const [collections, setCollections] = useState<CollectionsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
    rawData: null,
  });

  const fetchData = useCallback(async () => {
    setCollections((prevState) => {
      return { ...prevState, isLoading: false };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ALL,
    });
    if (error) {
      errorToast(error);
      return setCollections((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setCollections({
      data: data,
      hasError: null,
      isLoading: false,
      rawData: data.rawData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const sortOptionChangeHandler = (selectedOption: string) => {
    const selectedValue = selectedOption;
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
    <article className="relative">
      <header className="mb-8 px-1">
        <h2 className="inline-block text-xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {showMore && (
          <Link
            to={{ pathname: '/search', search: `category=${category}` }}
            className="ml-4 text-sm"
          >
            Show more
          </Link>
        )}
        {subtitle && <p className="mt-4 max-w-md text-slate-500">{subtitle}</p>}
      </header>
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex flex-grow gap-4">
          <PriceSelector
            highestPrice={
              collections.rawData && collections.rawData.highestPrice
            }
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
      <section>
        <SushiSwiper
          swiperCategory={category}
          itemsType="collection"
          arrayOfItems={collections.data}
          loadingState={collections.isLoading}
          errorState={collections.hasError}
        />
      </section>
    </article>
  );
}

BasicCollectionWidget.defaultProps = defaultProps;
