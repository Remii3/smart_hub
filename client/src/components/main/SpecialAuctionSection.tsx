import MainPageHeading from '../UI/MainPageHeading';
import SpecialAuctionsSwiper from '../swiper/SpecialAuctionsSwiper';

export default function SpecialAuctionSection() {
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
        <div className="test flex h-auto w-full max-w-[100%] items-center lg:max-w-[70%] lg:py-32">
          <SpecialAuctionsSwiper />
        </div>
      </div>
    </section>
  );
}
