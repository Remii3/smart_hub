import { Swiper } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { ReactNode } from 'react';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';

import 'swiper/css';
import 'swiper/css/pagination';

type SpecialSwiperTypes = {
  children: ReactNode;
  swiperCategory: string;
  swiperHandler?: () => void | null;
};

const defaultTypes = {
  swiperHandler: null,
};

function SpecialSwiper({
  children,
  swiperCategory,
  swiperHandler,
}: SpecialSwiperTypes) {
  return (
    <Swiper
      className="bestAuction-swiper"
      pagination
      grabCursor
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      }}
      touchEventsTarget="container"
      modules={[Pagination, Autoplay]}
      spaceBetween={60}
      onSlideChange={swiperHandler && swiperHandler}
      style={{
        paddingBottom: '50px',
        cursor: 'grab',
      }}
      effect="coverflow"
      centeredSlides
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: true,
      }}
      breakpoints={{
        388: {
          slidesPerView: 1,
        },
        679: {
          slidesPerView: 2,
        },
      }}
    >
      <SuspenseComponent fallback={<LoadingCircle />}>
        {children}
      </SuspenseComponent>
    </Swiper>
  );
}
SpecialSwiper.defaultProps = defaultTypes;
export default SpecialSwiper;
