import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import SuspenseComponent from '../UI/suspense/SuspenseComponent';
import LoadingComponent from '../UI/Loaders/LoadingComponent';

import 'swiper/swiper-bundle.css';

function ProductSwiper({ children }: { children: ReactNode }) {
  return (
    <Swiper
      style={{ paddingBottom: '50px' }}
      slidesPerView={3}
      //   slidesPerGroup={1}
      spaceBetween={24}
      grabCursor
      allowTouchMove
      navigation
      pagination
      modules={[Navigation, Pagination]}
      //   watchOverflow
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        700: {
          slidesPerView: 2,
        },
        1100: {
          slidesPerView: 3,
        },
      }}
    >
      <SuspenseComponent fallback={<LoadingComponent />}>
        {children}
      </SuspenseComponent>
    </Swiper>
  );
}

export default ProductSwiper;
