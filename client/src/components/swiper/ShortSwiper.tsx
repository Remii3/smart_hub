import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

import 'swiper/swiper-bundle.css';

function ShortSwiper({
  children,
  swiperCategory,
}: {
  children: ReactNode;
  swiperCategory: string;
}) {
  return (
    <div className="relative md:px-10">
      <Swiper
        pagination
        navigation={{
          nextEl: `.${swiperCategory}-next`,
          prevEl: `.${swiperCategory}-prev`,
        }}
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        setWrapperSize
        grabCursor
        watchOverflow
        breakpoints={{
          388: {
            slidesPerView: 1,
          },
          679: {
            slidesPerView: 2,
            pagination: false,
          },
          970: {
            slidesPerView: 3,
            pagination: false,
          },
        }}
        style={{
          paddingBottom: '40px',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <SuspenseComponent fallback={<LoadingCircle isLoading />}>
          {children}
        </SuspenseComponent>
      </Swiper>
      <div className="hidden md:block">
        <button type="button" className={`${swiperCategory}-prev`}>
          <ChevronLeftIcon className="absolute -left-2 top-1/2 h-11 w-11 -translate-y-10 text-primary transition duration-150 ease-out hover:text-blue-700 active:text-blue-800" />
        </button>
        <button type="button" className={`${swiperCategory}-next`}>
          <ChevronRightIcon className="absolute -right-2 top-1/2 h-11 w-11 -translate-y-10 text-primary transition duration-150 ease-out hover:text-blue-700 active:text-blue-800" />
        </button>
      </div>
    </div>
  );
}

export default ShortSwiper;
