import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import axios from 'axios';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import MainPageHeading from '../UI/MainPageHeading';
import AuctionsSwiper from '../swiper/LongSwiper';
import { ProductTypes } from '../../types/interfaces';
import AuctionCard from '../card/AuctionCard';

export default function AllAuctionsSection() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<ProductTypes[]>([]);

  useEffect(() => {
    try {
      axios.get('/product/auction-products').then((res) => {
        setAuctions(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (auctions.length < 1) return <div />;
  return (
    <section className="relative flex w-full flex-col items-center gap-12 bg-white px-0 pb-24 lg:px-12">
      <div className="w-full">
        <MainPageHeading
          color="dark"
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
                price={product.price}
                authors={product.authors}
                description={product.description}
                imgs={product.imgs}
              />
            </SwiperSlide>
          ))}
        </AuctionsSwiper>
      </div>
      <div className="w-full text-center">
        <PrimaryBtn
          type="button"
          usecase="default"
          onClick={() => {
            navigate('/auctions');
          }}
        >
          See all auctions
        </PrimaryBtn>
      </div>
    </section>
  );
}
