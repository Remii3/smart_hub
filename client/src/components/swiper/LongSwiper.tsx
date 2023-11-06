import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

function LongSwiper({
  children,
  swiperCategory,
}: {
  children: ReactNode;
  swiperCategory: string;
}) {
  return (
    <div className="relative md:px-5">
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
          1261: {
            slidesPerView: 4,
            pagination: false,
          },
        }}
        style={{
          paddingBottom: '40px',
          paddingLeft: '22px',
          paddingRight: '22px',
        }}
      >
        <SuspenseComponent fallback={<LoadingCircle />}>
          {children}
        </SuspenseComponent>
      </Swiper>
      <div className="hidden md:block">
        <button type="button" className={`${swiperCategory}-prev`}>
          <ChevronLeftIcon className="absolute -left-1 top-1/2 z-10 h-11 w-11 -translate-y-10 text-primary transition duration-150 ease-out hover:text-blue-700 active:text-blue-800" />
        </button>
        <button type="button" className={`${swiperCategory}-next`}>
          <ChevronRightIcon className="absolute -right-1 top-1/2 z-10 h-11 w-11 -translate-y-10 text-primary transition duration-150 ease-out hover:text-blue-700 active:text-blue-800" />
        </button>
      </div>
    </div>
  );
}

export default LongSwiper;
