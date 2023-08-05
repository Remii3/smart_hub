import { Link } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { ChangeEvent, useState } from 'react';
import { UnknownProductTypes } from '../../types/interfaces';
import PriceSelector from '../UI/ProductCollectionHelpers/PriceSelector';
import SortProducts from '../UI/ProductCollectionHelpers/SortProducts';
import sortProducts, { sortProductsTypes } from '../../helpers/sortProducts';
import { filterProductsByPrice } from '../../helpers/filterProducts';
import ShopCard from '../card/ShopCard';
import LongSwiper from '../swiper/LongSwiper';
import AuctionCard from '../card/AuctionCard';

type PropsTypes = {
  title: string;
  subTitle?: string | null;
  showMore?: boolean;
  allProducts: UnknownProductTypes[];
  category: string;
  marketPlace: 'Shop' | 'Auction';
};

const defaultProps = {
  showMore: false,
  subTitle: null,
};

export default function BasicProductCollection({
  allProducts,
  title,
  subTitle,
  showMore,
  category,
  marketPlace,
}: PropsTypes) {
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState<string | number>('');
  const [maxPrice, setMaxPrice] = useState<string | number>('');
  let finalProducts = allProducts;
  const highestPrice = sortProducts({
    products: allProducts,
    sortType: sortProductsTypes.PRICE_DESC,
  })[0];

  const sortOptionChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
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

  if (sortOption) {
    finalProducts = sortProducts({
      products: allProducts,
      sortType: sortOption,
    });
  }

  finalProducts = filterProductsByPrice({
    products: finalProducts,
    minPrice,
    maxPrice,
  });

  const noProducts =
    allProducts.length < 1 ? (
      <p className="pl-4">Empty collection </p>
    ) : (
      <p className="pl-4">No products found</p>
    );
  return (
    <section>
      <header className="px-4">
        <h2 className="inline-block text-xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {showMore && (
          <Link
            to={{ pathname: '/search', search: 'category=New-series' }}
            className="pl-4 text-sm"
          >
            Show more
          </Link>
        )}
        {subTitle && <p className="mt-4 max-w-md text-gray-500">{subTitle}</p>}
      </header>
      <div className="mt-8 flex items-center justify-between px-4">
        <div className="flex flex-grow gap-4">
          <PriceSelector
            highestPrice={highestPrice ? highestPrice.shop_info.price : 0}
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
            sortOption={sortOption}
            sortOptionChangeHandler={sortOptionChangeHandler}
          />
        </div>
      </div>
      <div className="mt-4">
        {finalProducts && finalProducts.length > 0 ? (
          <LongSwiper swiperCategory={category}>
            {finalProducts.map((product, id) => (
              <SwiperSlide key={id}>
                <div>
                  {marketPlace === 'Shop' ? (
                    <ShopCard
                      _id={product._id}
                      price={product.shop_info.price}
                      productQuantity={product.quantity}
                      title={product.title}
                      authors={product.authors}
                      description={product.description}
                      img={product.img}
                    />
                  ) : (
                    <AuctionCard
                      _id={product._id}
                      title={product.title}
                      authors={product.authors}
                      description={product.description}
                      img={product.img}
                      startingPrice={product.auction_info.starting_price}
                      currentPrice={product.auction_info.current_price}
                      auctionEndDate={product.auction_info.auction_end_date}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </LongSwiper>
        ) : (
          noProducts
        )}
      </div>
    </section>
  );
}

BasicProductCollection.defaultProps = defaultProps;
