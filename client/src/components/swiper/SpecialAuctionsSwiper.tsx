import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { useState } from 'react';
import { BookTypes } from '../../types/interfaces';
import SpecialAuctionCard from '../card/SpecialAuctionCard';

interface PropsTypes extends BookTypes {
  deadline?: Date;
}

function SpecialAuctionsSwiper({ swiperItems }: { swiperItems: PropsTypes[] }) {
  const [bestAuctionCardFlag, setBestAuctionCardFlag] = useState(true);
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
      {swiperItems.map((auctionItem) => (
        <SwiperSlide key={auctionItem._id}>
          <SpecialAuctionCard
            id={auctionItem._id}
            coverUrl={auctionItem.cover_url}
            title={auctionItem.title}
            description={auctionItem.description}
            deadline={auctionItem.deadline || null}
            minBid={auctionItem.price}
            swipedFlag={bestAuctionCardFlag}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SpecialAuctionsSwiper;
