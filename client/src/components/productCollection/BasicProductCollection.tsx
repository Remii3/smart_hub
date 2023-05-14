import { Link } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import BasicSwiper from '../swiper/BasicSwiper';
import { ProductTypes } from '../../types/interfaces';
import PriceSelector from '../UI/ProductCollectionHelpers/PriceSelector';
import SortProducts from '../UI/ProductCollectionHelpers/SortProducts';

type PropsTypes = {
  title: string;
  subTitle?: string | null;
  showMore?: boolean;
  allProducts: ProductTypes[];
};

const defaultProps = {
  showMore: false,
  subTitle: null,
};

function BasicProductCollection({
  allProducts,
  title,
  subTitle,
  showMore,
}: PropsTypes) {
  const [highestPrice, setHighestPrice] = useState(0);

  useEffect(() => {
    console.log(allProducts.sort());
  }, [allProducts]);

  return (
    <section>
      <header className="px-4">
        <h2 className="inline-block text-xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {showMore && (
          <Link
            to={{ pathname: '/shop/search', search: 'category=New-series' }}
            className="pl-4 text-sm"
          >
            Show more
          </Link>
        )}
        {subTitle && <p className="mt-4 max-w-md text-gray-500">{subTitle}</p>}
      </header>
      <div className="mt-8 px-4 sm:flex sm:items-center sm:justify-between">
        <div className="block sm:hidden">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
          >
            <span className="text-sm font-medium"> Filters & Sorting </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 rtl:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden sm:flex sm:gap-4">
          <PriceSelector highestPrice={highestPrice} />
        </div>
        <div className="hidden sm:block">
          <SortProducts />
        </div>
      </div>
      <div className="mt-4">
        <BasicSwiper>
          {allProducts &&
            allProducts.length > 0 &&
            allProducts.map((product, id) => (
              <SwiperSlide key={id}>
                <div>
                  <Link
                    to={`/product/${product._id}`}
                    className="group block overflow-hidden"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                      alt=""
                      className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                    />

                    <div className="relative bg-white pt-3">
                      <h3 className="mt-4 text-lg text-gray-700 group-hover:underline group-hover:underline-offset-4">
                        {product.title}
                      </h3>

                      <p className="mt-2">
                        <span className="sr-only"> Regular Price </span>

                        <span className="tracking-wider text-gray-900">
                          {product.price}
                        </span>
                      </p>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
        </BasicSwiper>
      </div>
    </section>
  );
}

BasicProductCollection.defaultProps = defaultProps;

export default BasicProductCollection;
