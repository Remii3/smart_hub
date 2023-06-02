import { Link } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import BasicSwiper from '../swiper/BasicSwiper';
import { ProductTypes } from '../../types/interfaces';
import PriceSelector from '../UI/ProductCollectionHelpers/PriceSelector';
import SortProducts from '../UI/ProductCollectionHelpers/SortProducts';

type PropsTypes = {
  title: string;
  subTitle?: string | null;
  showMore?: boolean;
  allProducts: ProductTypes[];
  category: string;
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
  category,
}: PropsTypes) {
  const [highestPrice, setHighestPrice] = useState(0);

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
      <div className="mt-8 flex items-center justify-between px-4">
        <div className="flex gap-4">
          <PriceSelector highestPrice={highestPrice} category={category} />
        </div>
        <div className="block">
          <SortProducts category={category} />
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
