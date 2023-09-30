import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import axios from 'axios';
import MainPageHeading from '@pages/home/MainPageHeading';
import AuctionsSwiper from '@components/swiper/LongSwiper';
import { AuctionProductTypes } from '@customTypes/interfaces';
import AuctionCard from '@components/cards/AuctionCard';
import { buttonVariants } from '@components/UI/button';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';

export default function AllAuctionsSection() {
  const [auctions, setAuctions] = useState<AuctionProductTypes[]>([]);

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_AUCTION_ALL,
    });
    setAuctions(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (auctions.length < 1) return <div />;
  return (
    <section className="relative flex w-full flex-col items-center gap-12 bg-background px-0 pb-24 lg:px-12">
      <div className="w-full">
        <MainPageHeading
          color="foreground"
          usecase="sub"
          mainTitle="Similar auctions"
          subTitle="You may like this too"
        />
      </div>
      <div className="px-auto w-full ">
        <AuctionsSwiper swiperCategory="all-auctions">
          {auctions.map((product) => (
            <SwiperSlide key={product._id}>
              <AuctionCard
                _id={product._id}
                title={product.title}
                authors={product.authors}
                description={product.description}
                img={product.img}
                auctionEndDate={product.auction_info.auction_end_date}
                currentPrice={product.auction_info.current_price}
                startingPrice={product.auction_info.starting_price}
              />
            </SwiperSlide>
          ))}
        </AuctionsSwiper>
      </div>
      <div className="w-full text-center">
        <Link to="/auctions" className={buttonVariants({ variant: 'default' })}>
          See all auctions
        </Link>
      </div>
    </section>
  );
}
