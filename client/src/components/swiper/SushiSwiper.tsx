import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MarketplaceTypes } from '@customTypes/types';
import ShopCard from '@components/cards/ShopCard';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import { Skeleton } from '@components/UI/skeleton';

interface PropsTypes {
  swiperCategory: string;
  arrayOfItems: any[] | null;
  itemsType: MarketplaceTypes;
  loadingState?: boolean;
  errorState?: string | null;
}

export default function SushiSwiper({
  swiperCategory,
  arrayOfItems,
  itemsType,
  loadingState,
  errorState,
}: PropsTypes) {
  return (
    <div className="relative">
      <Swiper
        navigation={{
          nextEl: `.swiper-${swiperCategory}-button-next`,
          prevEl: `.swiper-${swiperCategory}-button-prev`,
        }}
        grabCursor
        slidesPerView={1.2}
        pagination={{
          clickable: true,
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
                  key={index}
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
            arrayOfItems.map(
              (item) =>
                itemsType === 'Shop' && (
                  <SwiperSlide
                    key={swiperCategory + item._id}
                    className="min-w-[280px] pr-8"
                  >
                    <ShopCard
                      _id={item._id}
                      price={item.shop_info.price}
                      productQuantity={item.quantity}
                      title={item.title}
                      authors={item.authors}
                      description={item.description}
                      img={
                        item.imgs && item.imgs.length > 0
                          ? item.imgs[0].url
                          : ''
                      }
                      rating={item.rating}
                    />
                  </SwiperSlide>
                )
            )}
        </SuspenseComponent>
        <div
          className={`swiper-button-next swiper-${swiperCategory}-button-next color-primary right-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
        ></div>
        <div
          className={`swiper-button-prev swiper-${swiperCategory}-button-prev color-primary left-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
        ></div>
      </Swiper>
    </div>
  );
}
