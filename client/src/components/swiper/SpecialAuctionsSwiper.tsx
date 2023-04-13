import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { lazy, useEffect, useState } from 'react';
import axios from 'axios';
import { BookTypes } from '../../types/interfaces';
import SuspenseComponent from '../suspense/SuspenseComponent';
import LoadingComponent from '../UI/LoadingComponent';

const SpecialAuctionCard = lazy(() => import('../card/SpecialAuctionCard'));

interface SpecialAuctionsTypes extends BookTypes {
  deadline?: Date;
}

function SpecialAuctionsSwiper() {
  const [specialAuctions, setSpecialAuctions] = useState<
    SpecialAuctionsTypes[]
  >([]);
  const [bestAuctionCardFlag, setBestAuctionCardFlag] = useState(true);
  useEffect(() => {
    try {
      axios.get('/product/books').then((res) => {
        setSpecialAuctions(res.data.slice(0, 6));
      });
    } catch (err) {
      console.error(err);
    }
  }, []);
  return (
    <Swiper
      className="bestAuction-swiper"
      pagination
      autoplay={{
        delay: 8000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
        waitForTransition: true,
      }}
      grabCursor
      modules={[Autoplay, Pagination]}
      spaceBetween={52}
      slidesPerView={1}
      onSlideChange={() => setBestAuctionCardFlag((prev) => !prev)}
      style={{
        paddingBottom: '52px',
      }}
    >
      {specialAuctions.map((auctionItem) => (
        <SwiperSlide key={auctionItem._id}>
          <SuspenseComponent fallback={<LoadingComponent />}>
            <SpecialAuctionCard
              id={auctionItem._id}
              coverUrl={auctionItem.cover_url}
              title={auctionItem.title}
              description={auctionItem.description}
              deadline={auctionItem.deadline || null}
              minBid={auctionItem.price}
              swipedFlag={bestAuctionCardFlag}
            />
          </SuspenseComponent>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SpecialAuctionsSwiper;
