import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
function ShortSwiper({
  children,
  swiperCategory,
}: {
  children: ReactNode;
  swiperCategory: string;
}) {
  return (
    <div className="relative">
      <Swiper
        navigation={{
          nextEl: `.swiper-${swiperCategory}-button-next`,
          prevEl: `.swiper-${swiperCategory}-button-prev`,
        }}
        slidesPerView={1.2}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
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
        style={{ paddingBottom: '56px', marginRight: '-16px' }}
      >
        <SuspenseComponent fallback={<LoadingCircle />}>
          {children}
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

export default ShortSwiper;
