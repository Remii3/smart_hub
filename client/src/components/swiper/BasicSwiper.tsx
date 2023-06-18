import { ReactNode } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation } from 'swiper';
import SuspenseComponent from '../UI/suspense/SuspenseComponent';
import LoadingComponent from '../UI/Loaders/LoadingComponent';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

function BasicSwiper({ children }: { children: ReactNode }) {
  return (
    <Swiper
      slidesPerView={4}
      slidesPerGroup={1}
      spaceBetween={28}
      grabCursor
      allowTouchMove
      navigation
      modules={[Navigation]}
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
      <SuspenseComponent fallback={<LoadingComponent />}>
        {children}
      </SuspenseComponent>
    </Swiper>
  );
}

export default BasicSwiper;
