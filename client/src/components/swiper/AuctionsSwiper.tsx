import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper';
import AuctionCard from '../card/AuctionCard';
import { BookTypes } from '../../types/interfaces';

interface PropsTypes extends BookTypes {
  deadline?: Date;
}

function AuctionsSwiper({ swiperItems }: { swiperItems: PropsTypes[] }) {
  return (
    <Swiper
      scrollbar={{
        hide: false,
      }}
      navigation
      grabCursor
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      modules={[Scrollbar, Navigation, Autoplay]}
      spaceBetween={52}
      slidesPerView={1}
      setWrapperSize
      breakpoints={{
        324: {
          slidesPerView: 1,
          scrollbar: { hide: false },
        },
        624: {
          slidesPerView: 2,
          scrollbar: { hide: false },
        },
        924: {
          slidesPerView: 3,
          scrollbar: { hide: true },
        },
        1224: {
          slidesPerView: 4,
        },
        1524: {
          slidesPerView: 5,
        },
        1680: {
          slidesPerView: 6,
        },
      }}
      style={{
        paddingBottom: '26px',
        paddingTop: '26px',
      }}
    >
      {swiperItems.map((auctionItem) => (
        <SwiperSlide key={auctionItem._id}>
          <AuctionCard
            id={auctionItem._id}
            title={auctionItem.title}
            authors={auctionItem.authors}
            deadline={auctionItem.deadline || null}
            minBid={auctionItem.price}
            coverUrl={auctionItem.cover_url}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default AuctionsSwiper;
