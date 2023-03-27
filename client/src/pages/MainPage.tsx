import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionCard from '../components/card/CollectionCard';
import Header from '../layout/Header';
import CategoryCard from '../components/card/CategoryCard';
import PrimaryBtn from '../components/UI/PrimaryBtn';
import Footer from '../layout/Footer';
import Main from '../layout/Main';
import BestAuctionCard from '../components/card/BestAuctionCard';
import AuctionCard from '../components/card/AuctionCard';
import MainPageHeading from '../components/UI/MainPageHeading';

import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

import '../assets/styles/swiper.css';
import { OverlayContext } from '../context/OverlayProvider';

function MainPage() {
  const navigate = useNavigate();

  const [bestAuctionCardFlag, setBestAuctionCardFlag] = useState(true);

  const testArray = [
    { id: 0, title: 'asd', description: 'zxczxzxc' },
    { id: 1, title: 'asd', description: 'zxczxzxc' },
    { id: 2, title: 'asd', description: 'zxczxzxc' },
    { id: 3, title: 'asd', description: 'zxczxzxc' },
    { id: 4, title: 'asd', description: 'zxczxzxc' },
    { id: 5, title: 'asd', description: 'zxczxzxc' },
  ];
  const testCollectionArray = [
    { id: 6, title: 'asd', description: 'zxczxzxc' },
    { id: 7, title: 'asd', description: 'zxczxzxc' },
    { id: 8, title: 'asd', description: 'zxczxzxc' },
    { id: 9, title: 'asd', description: 'zxczxzxc' },
  ];
  const testAuctionArray = [
    {
      id: 11,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 12,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 13,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 14,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 15,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 16,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 17,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
  ];
  const testBestAuctionArray = [
    {
      id: 18,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 19,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 21,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 22,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 23,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 24,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
    {
      id: 25,
      title: 'asd',
      author: 'asd',
      deadline: new Date(),
      description: 'zxczxzxc',
      price: 12,
    },
  ];
  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);
  const showProfileDropdown = () => {
    setShownOverlay((prevState) => !prevState);
  };
  return (
    <div
      id="mainPageScroll"
      className="relative min-h-screen overflow-auto bg-pageBackground perspective-3"
    >
      <Header />
      {shownOverlay && (
        <div
          className="parallax__group absolute inset-0 z-20 w-screen bg-black opacity-50 translate-z-0"
          onClick={showProfileDropdown}
        />
      )}
      <section className="parallax__group relative min-h-screen w-screen">
        <div className="sky absolute -top-20 left-0 right-0 bottom-0 flex h-screen w-full items-center justify-center brightness-50" />
      </section>
      {/* <div className="parallax_title absolute top-[65%] flex h-screen w-full justify-start md:top-[100%]  ">
        <div className="flex w-full flex-col  text-primaryText sm:items-start">
          <div className="mb-14 ml-[15%] max-w-xs sm:max-w-none">
            <h6 className="uppercase lg:text-4xl">Award winning literature</h6>
            <h1 className="uppercase text-white sm:text-5xl lg:text-7xl">
              <span className="inline-block w-full max-w-[80%]">
                Buy best selling
              </span>
              <span className="inline-block w-full max-w-[80%]">
                books in the
              </span>
              <span className="inline-block w-full max-w-[80%]">world</span>
            </h1>
          </div>
          <div className="ml-[15%]">
            <PrimaryBtn
              usecase="big"
              text="See now"
              onClick={() => {
                navigate('/shop');
              }}
            />
          </div>
        </div>
      </div> */}
      <Main>
        {/* Shop */}
        <div className="parallax__group relative flex min-h-screen w-screen scale-100 flex-col items-center justify-center overflow-y-hidden bg-white translate-z-0">
          <section className="relative flex w-full flex-col items-center gap-12 pb-16">
            <div className="relative -top-1 left-0 w-full bg-pageBackground">
              <MainPageHeading
                color="white"
                usecase="main"
                mainTitle="Reading with us is easy"
                subTitle="Offering a diverse array of book genres to choose from, for
                every occasion"
              />
            </div>
            <div className="w-full">
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
                {testArray.map((cardItem) => (
                  <CategoryCard
                    key={cardItem.id}
                    title={cardItem.title}
                    description={cardItem.description}
                  />
                ))}
              </div>
            </div>
            <div className="w-full text-center">
              <PrimaryBtn
                usecase="normal"
                text="See all genres"
                onClick={() => {
                  navigate('/shop');
                }}
              />
            </div>
          </section>
          {/* Special */}
          <section className="relative flex w-full flex-col items-center gap-12 pb-16">
            <div className="w-full bg-white">
              <MainPageHeading
                color="dark"
                usecase="main"
                mainTitle="Discover your next great read"
                subTitle="Unleash the power of imagination, explore new worlds and find
                your next favorite book with us"
              />
            </div>
            <div className="w-full">
              {testCollectionArray.map((collection, id) => (
                <CollectionCard
                  key={collection.id}
                  backcolor={(id + 1) % 2 ? 'pageBackground' : 'white'}
                  collectionData={collection}
                  lastItem={testCollectionArray.length === id + 1}
                />
              ))}
            </div>
          </section>
          <section className="relative flex w-full flex-col items-center bg-pageBackground pb-16">
            <div className="relative -top-1 left-0 w-full  bg-white">
              <MainPageHeading
                color="dark"
                usecase="main"
                mainTitle="Bid on books, find treasures within"
                subTitle="Books are the portal to endless possibilities"
              />
            </div>
            <div className="flex w-full flex-col gap-12 lg:flex-row lg:gap-0">
              <div className="w-full flex-grow">
                <div className="flex flex-col items-center px-4 py-6 text-center md:py-32 lg:items-start lg:pl-12">
                  <h3 className="mb-5 text-center text-white lg:text-left">
                    This makes our hearts beat faster every day
                  </h3>
                  <p className={`text-sm text-gray900 lg:text-lg `}>
                    Readers loved them
                  </p>
                </div>
              </div>
              <div className="flex h-auto w-full max-w-[100%] items-center transition-all duration-200 ease-out lg:max-w-[70%] lg:py-32">
                <Swiper
                  className="bestAuction-swiper"
                  pagination
                  autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
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
                  {testBestAuctionArray.map((auctionItem) => (
                    <SwiperSlide key={auctionItem.id}>
                      <BestAuctionCard
                        id={auctionItem.id}
                        title="asd"
                        description="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa sssssssssssssssssssssssssssssssssssssssssss dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd cccccccccccccccccccccccccccccccccccccccccc"
                        expDate={new Date()}
                        swipedFlag={bestAuctionCardFlag}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </section>
          <section className="relative flex w-full flex-col items-center gap-12 bg-white px-0 pb-24 sm:px-24">
            <div className="w-full">
              <MainPageHeading
                color="dark"
                usecase="sub"
                mainTitle="Similar auctions"
                subTitle="You may like this too"
              />
            </div>
            <div className="px-auto w-full max-w-[1648px]">
              <Swiper
                scrollbar={{
                  hide: false,
                }}
                autoHeight
                navigation
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                modules={[Scrollbar, Navigation, Autoplay]}
                spaceBetween={52}
                slidesPerView={1}
                breakpoints={{
                  324: {
                    slidesPerView: 1,
                    spaceBetween: 52,
                    scrollbar: { hide: false },
                  },
                  663: {
                    slidesPerView: 2,
                    spaceBetween: 52,
                    scrollbar: { hide: false },
                  },
                  1002: {
                    slidesPerView: 3,
                    spaceBetween: 52,
                    scrollbar: { hide: true },
                  },
                  1341: {
                    slidesPerView: 4,
                    spaceBetween: 52,
                  },
                  1680: {
                    slidesPerView: 5,
                    spaceBetween: 52,
                  },
                }}
                style={{
                  paddingBottom: '26px',
                  paddingTop: '26px',
                }}
              >
                {testAuctionArray.map((auctionData) => (
                  <SwiperSlide key={auctionData.id}>
                    <AuctionCard
                      title={auctionData.title}
                      author={auctionData.author}
                      deadline={auctionData.deadline}
                      price={auctionData.price}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="w-full text-center">
              <PrimaryBtn
                text="See all auctions"
                usecase="normal"
                onClick={() => {
                  navigate('/auctions');
                }}
              />
            </div>
          </section>
        </div>
      </Main>
      <Footer />
    </div>
  );
}

export default MainPage;
