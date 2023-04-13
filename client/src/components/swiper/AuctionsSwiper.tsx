import { lazy, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper';
import axios from 'axios';
import { BookTypes } from '../../types/interfaces';
import SuspenseComponent from '../suspense/SuspenseComponent';
import LoadingComponent from '../UI/LoadingComponent';

const AuctionCard = lazy(() => import('../card/AuctionCard'));

interface AuctionsTypes extends BookTypes {
  deadline?: Date;
}

function AuctionsSwiper() {
  const [auctions, setAuctions] = useState<AuctionsTypes[]>([]);

  useEffect(() => {
    try {
      axios.get('/product/books').then((res) => {
        setAuctions(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

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
      {auctions.map((auctionItem) => (
        <SwiperSlide key={auctionItem._id}>
          <SuspenseComponent fallback={<LoadingComponent />}>
            <AuctionCard
              id={auctionItem._id}
              title={auctionItem.title}
              authors={auctionItem.authors}
              deadline={auctionItem.deadline || null}
              minBid={auctionItem.price}
              coverUrl={auctionItem.cover_url}
            />
          </SuspenseComponent>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default AuctionsSwiper;
