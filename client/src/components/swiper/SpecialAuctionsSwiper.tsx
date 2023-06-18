import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { lazy, useEffect, useState } from 'react';
import axios from 'axios';
import { ProductTypes } from '../../types/interfaces';
import SuspenseComponent from '../UI/suspense/SuspenseComponent';
import LoadingComponent from '../UI/Loaders/LoadingComponent';
import 'swiper/css';
import 'swiper/css/pagination';

const SpecialAuctionCard = lazy(() => import('../card/SpecialAuctionCard'));

interface SpecialAuctionsTypes extends ProductTypes {
  deadline?: Date;
}

function SpecialAuctionsSwiper() {
  const [specialAuctions, setSpecialAuctions] = useState<
    SpecialAuctionsTypes[]
  >([]);
  const [bestAuctionCardFlag, setBestAuctionCardFlag] = useState(true);
  useEffect(() => {
    try {
      axios.get('/product/auction-products').then((res) => {
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
              _id={auctionItem._id}
              title={auctionItem.title}
              description={auctionItem.description}
              imgs={auctionItem.imgs}
              deadline={auctionItem.deadline || null}
              price={auctionItem.price}
              swipedFlag={bestAuctionCardFlag}
            />
          </SuspenseComponent>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SpecialAuctionsSwiper;
