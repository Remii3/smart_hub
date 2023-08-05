import axios from 'axios';
import { useState, useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';
import MainPageHeading from '../UI/SpecialElements/MainPageHeading';
import SpecialAuctionsSwiper from '../swiper/SpecialSwiper';
import SpecialAuctionCard from '../card/SpecialAuctionCard';
import { AuctionProductTypes } from '../../types/interfaces';

export default function SpecialAuctionSection() {
  const [specialAuctions, setSpecialAuctions] = useState<AuctionProductTypes[]>(
    []
  );

  const [bestAuctionCardFlag, setBestAuctionCardFlag] = useState(true);

  useEffect(() => {
    axios.get('/product/auction-products').then((res) => {
      setSpecialAuctions(res.data.slice(0, 6));
    });
  }, []);

  const swiperHandler = () => {
    setBestAuctionCardFlag(false);
  };

  return (
    <section className="relative flex w-full flex-col items-center bg-pageBackground">
      <div className="relative -top-1 left-0 w-full bg-white">
        <MainPageHeading
          color="dark"
          usecase="main"
          mainTitle="Bid on books, find treasures within"
          subTitle="Books are the portal to endless possibilities"
        />
      </div>
      <div className="flex w-full flex-col gap-0 lg:flex-row">
        <div className="w-full flex-grow">
          <MainPageHeading
            color="white"
            usecase="sub"
            mainTitle="Selected by community"
            subTitle="Readers loved them and voted them the best"
          />
        </div>
        <div className="test flex h-auto w-full max-w-[100%] items-center px-10 sm:px-0 lg:max-w-[70%] lg:py-32">
          <SpecialAuctionsSwiper
            swiperCategory="special"
            swiperHandler={swiperHandler}
          >
            {specialAuctions.map((product) => (
              <SwiperSlide key={product._id}>
                <SpecialAuctionCard
                  _id={product._id}
                  title={product.title}
                  swipedFlag={bestAuctionCardFlag}
                  description={product.description}
                  auctionEndDate={product.auction_info.auction_end_date}
                  authors={product.authors}
                  currentPrice={product.auction_info.current_price}
                  startingPrice={product.auction_info.starting_price}
                  img={product.img}
                />
              </SwiperSlide>
            ))}
          </SpecialAuctionsSwiper>
        </div>
      </div>
    </section>
  );
}
