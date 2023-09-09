import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

function BasicSwiper({ children }: { children: ReactNode }) {
  return (
    <Swiper
      style={{ paddingBottom: '50px' }}
      slidesPerView={3}
      slidesPerGroup={1}
      spaceBetween={24}
      grabCursor
      allowTouchMove
      navigation
      pagination
      modules={[Navigation, Pagination]}
      watchOverflow
      breakpoints={{
        0: {
          slidesPerView: 1.2,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        480: {
          slidesPerView: 1.5,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        767: {
          slidesPerView: 3.2,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        992: {
          slidesPerView: 4,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
      }}
    >
      <SuspenseComponent fallback={<LoadingCircle isLoading />}>
        {children}
      </SuspenseComponent>
    </Swiper>
  );
}

export default BasicSwiper;
