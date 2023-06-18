import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import MainPageHeading from '../UI/MainPageHeading';
import AuctionsSwiper from '../swiper/AuctionsSwiper';

export default function AllAuctionsSection() {
  const navigate = useNavigate();

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
        <AuctionsSwiper />
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
