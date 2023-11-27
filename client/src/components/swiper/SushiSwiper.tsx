import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { useEffect } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ShopCard from '@components/cards/ShopCard';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import { Skeleton } from '@components/UI/skeleton';
import SwiperArrowRight from './navigation/SwiperArrowRight';
import SwiperArrowLeft from './navigation/SwiperArrowLeft';
import SwiperDots from './pagination/SwiperDots';

interface PropsTypes {
  swiperCategory: string;
  arrayOfItems: any[] | null;
  loadingState?: boolean;
  errorState?: string | null;
}

export default function SushiSwiper({
  swiperCategory,
  arrayOfItems,
  loadingState,
  errorState,
}: PropsTypes) {
  useEffect(() => {}, [swiperCategory]);
  return (
    <div className="relative">
      <Swiper
        navigation={{
          nextEl: `.swiper-${swiperCategory}-next`,
          prevEl: `.swiper-${swiperCategory}-prev`,
        }}
        grabCursor
        slidesPerView={1.2}
        pagination={{
          clickable: true,
          el: `.swiper-${swiperCategory}-pagination`,
        }}
        breakpoints={{
          540: {
            slidesPerView: 1.5,
            navigation: {
              enabled: false,
            },
          },

          640: {
            slidesPerView: 2.2,
            navigation: {
              enabled: false,
            },
          },

          768: {
            slidesPerView: 2.5,
            navigation: {
              enabled: false,
            },
          },

          1024: {
            slidesPerView: 3.2,
            navigation: {
              enabled: true,
            },
          },
          1280: {
            slidesPerView: 4.2,
            navigation: {
              enabled: true,
            },
          },
        }}
        modules={[Pagination, Navigation]}
        style={{ marginRight: '-16px', padding: '4px 4px 56px' }}
      >
        <SuspenseComponent fallback={<LoadingCircle />}>
          {loadingState && (
            <div className="flex items-center sm:flex-row">
              {[...Array(3)].map((el, index) => (
                <div
                  key={index + 'skeletonCard'}
                  className="h-[383px] w-[calc(100%/1.5)] min-w-[280px] pr-8 sm:w-[calc(100%/1.9)] md:w-[calc(100%/2.9)] lg:w-[calc(100%/3.2)] xl:w-[calc(100%/4.2)]"
                >
                  <Skeleton
                    className={`flex h-full w-full max-w-[280px] flex-col gap-3`}
                  >
                    <Skeleton className="h-[160px] w-full rounded-b-none rounded-t-lg" />
                    <div className="flex flex-col gap-2 px-3 pt-3">
                      <Skeleton className="h-3 w-1/3 md:w-1/4" />
                      <Skeleton className="h-3 w-1/2 md:w-1/3" />
                      <Skeleton className="h-3 w-3/4 md:w-1/2" />
                    </div>
                  </Skeleton>
                </div>
              ))}
            </div>
          )}
          {!loadingState && errorState && <ErrorMessage message={errorState} />}
          {!loadingState && arrayOfItems && arrayOfItems.length <= 0 && (
            <div className="mx-8">No products</div>
          )}
          {!loadingState &&
            arrayOfItems &&
            arrayOfItems.length > 0 &&
            arrayOfItems.map((item) => (
              <SwiperSlide
                key={item._id}
                id={item._id}
                style={{ height: 'auto' }}
                className="min-w-[280px] pr-8"
              >
                <ShopCard
                  _id={item._id}
                  categories={item.categories}
                  price={item.price.value}
                  productQuantity={item.quantity}
                  title={item.title}
                  authors={item.authors}
                  shortDescription={item.shortDescription}
                  img={
                    item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''
                  }
                  rating={item.rating}
                  type={item.marketplace}
                />
              </SwiperSlide>
            ))}
        </SuspenseComponent>
        <SwiperArrowRight elId={`swiper-${swiperCategory}-next`} />
        <SwiperArrowLeft elId={`swiper-${swiperCategory}-prev`} />
        <SwiperDots elId={`swiper-${swiperCategory}-pagination`} />
      </Swiper>
    </div>
  );
}
