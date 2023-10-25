import { Link } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { UnknownProductTypes } from '@customTypes/interfaces';
import PriceSelector from './PriceSelector';
import SortProducts from '../../features/sortProducts/SortProducts';
import ShopCard, { SkeletonShopCard } from '@components/cards/ShopCard';
import useSortProducts, {
  SortType,
  sortOptions,
  sortOptionsArray,
} from '@hooks/useSortProducts';
import useFilterProducts from '@hooks/useFilterProducts';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import ShortSwiper from '@components/swiper/ShortSwiper';

type PropsTypes = {
  title: string;
  subTitle?: string | null;
  showMore?: boolean;
  category: string;
  marketPlace: 'Shop' | 'Auction';
};

const defaultProps = {
  showMore: false,
  subTitle: null,
};

type ProductsType = {
  originalData: UnknownProductTypes[] | null;
  filteredData: UnknownProductTypes[] | null;
  isLoading: boolean;
};

export default function BasicProductCollection({
  title,
  subTitle,
  showMore,
  category,
  marketPlace,
}: PropsTypes) {
  const [selectedSortOption, setSelectedSortOption] = useState<SortType>(
    sortOptions.DATE_DESC
  );
  const [minPrice, setMinPrice] = useState<string | number>('');
  const [maxPrice, setMaxPrice] = useState<string | number>('');
  const [products, setProducts] = useState<ProductsType>({
    filteredData: null,
    isLoading: true,
    originalData: null,
  });
  let highestPrice =
    products &&
    products.originalData &&
    products.originalData.length > 0 &&
    [...products.originalData].sort((a, b) =>
      a.shop_info.price > b.shop_info.price ? -1 : 1
    )[0].shop_info.price;

  const filterData = (rawData: UnknownProductTypes[]) => {
    const { sortedProducts } = useSortProducts({
      sortType: selectedSortOption,
      products: (rawData && [...rawData]) || [],
    });
    const { filteredProducts } = useFilterProducts({
      products: [...sortedProducts],
      filterData: {
        filterType: 'Price',
        filterValues: { minPrice, maxPrice },
      },
    });
    return { filteredProducts };
  };

  const fetchData = useCallback(async () => {
    setProducts((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_SHOP_ALL,
      params: {
        category,
        minPrice,
        maxPrice,
      },
    });

    const { filteredProducts } = filterData(data);

    setTimeout(() => {
      setProducts({
        originalData: data,
        filteredData: filteredProducts,
        isLoading: false,
      });
    }, 100);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (products.originalData) {
      const { filteredProducts } = filterData(products.originalData);
      setProducts((prevState) => {
        return {
          originalData: prevState.originalData,
          filteredData: filteredProducts,
          isLoading: prevState.isLoading,
        };
      });
    }
  }, [minPrice, maxPrice, selectedSortOption]);

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
        {subTitle && <p className="mt-4 max-w-md text-gray-500">{subTitle}</p>}
      </header>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-grow gap-4">
          <PriceSelector
            highestPrice={highestPrice || 0}
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
      {products.isLoading && (
        <div className="mx-8 flex flex-col items-center gap-4 sm:flex-row">
          {[...Array(3)].map((el, index) => (
            <SkeletonShopCard
              key={index}
              height="h-[330px]"
              width="w-[280px]"
            />
          ))}
        </div>
      )}
      {!products.isLoading && !products.filteredData && (
        <p className="mx-8">No products</p>
      )}
      {!products.isLoading &&
        products.filteredData &&
        products.filteredData.length > 0 && (
          <ShortSwiper swiperCategory={category}>
            {products.filteredData.map((product, id) => (
              <SwiperSlide key={id} className="pr-8">
                <ShopCard
                  _id={product._id}
                  price={product.shop_info.price}
                  productQuantity={product.quantity}
                  title={product.title}
                  authors={product.authors}
                  description={product.description}
                  img={
                    product.imgs && product.imgs.length > 0
                      ? product.imgs[0].url
                      : ''
                  }
                  rating={product.rating}
                />
              </SwiperSlide>
            ))}
          </ShortSwiper>
        )}
    </section>
  );
}

BasicProductCollection.defaultProps = defaultProps;
