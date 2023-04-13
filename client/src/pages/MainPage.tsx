import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import CollectionCard from '../components/card/CollectionCard';
import Header from '../layout/Header';
import CategoryCard from '../components/card/ShopCategoryCard';
import PrimaryBtn from '../components/UI/PrimaryBtn';
import Footer from '../layout/Footer';
import Main from '../layout/Main';
import MainPageHeading from '../components/UI/MainPageHeading';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

import '../assets/styles/swiper.css';
import { CategoryCardTypes } from '../types/types';
import { BookTypes } from '../types/interfaces';
import SpecialAuctionsSwiper from '../components/swiper/SpecialAuctionsSwiper';
import AuctionsSwiper from '../components/swiper/AuctionsSwiper';

function MainPage() {
  const [shopList, setShopList] = useState<CategoryCardTypes[]>([]);
  const [collection, setCollection] = useState<BookTypes[]>([]);
  const imgBg = useRef(null);

  const navigate = useNavigate();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.to(imgBg.current, {
      scrollTrigger: {
        scrub: 1,
      },
      duration: 0.5,
      y: '-50%',
      scale: 1.5,
      ease: 'sine.out',
    });
    try {
      axios.get('/product/categories').then((res) => {
        setShopList(res.data);
      });
    } catch (err) {
      console.error(err);
    }
    try {
      axios.get('/product/books').then((res) => {
        setCollection(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden  bg-pageBackground">
      <Header />
      <div className="relative">
        <section className="relative h-screen w-full overflow-hidden">
          <div
            ref={imgBg}
            className="absolute left-0 top-0 h-full w-full scale-125 bg-mainBanner bg-cover bg-center bg-no-repeat brightness-50"
          />
          <div className="absolute top-[15%] flex h-screen w-full justify-start sm:top-1/4">
            <div className="flex w-full flex-col text-primaryText sm:items-start">
              <div className="mb-14 ml-[15%] max-w-xs sm:max-w-none">
                <h6 className="uppercase md:text-4xl">
                  Award winning literature
                </h6>
                <h1 className="uppercase text-white ">
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
          </div>
        </section>
        <Main>
          <div className="parallax__group relative flex min-h-screen w-full flex-col items-center justify-center overflow-y-hidden bg-white ">
            {/* Shop */}
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
                  {shopList.slice(0, 6).map((cardItem) => (
                    <CategoryCard
                      key={cardItem._id}
                      cat_name={cardItem.name}
                      cat_description={cardItem.description}
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
            {/* Gallery */}
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
                {collection.slice(0, 4).map((collection_data, id) => (
                  <CollectionCard
                    key={collection_data._id}
                    backcolor={(id + 1) % 2 ? 'pageBackground' : 'white'}
                    collectionData={collection_data}
                    lastItem={collection.length === id + 1}
                  />
                ))}
              </div>
            </section>
            {/* Special auctions */}
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
                <div className="flex h-auto w-full max-w-[100%] items-center lg:max-w-[70%] lg:py-32">
                  <SpecialAuctionsSwiper />
                </div>
              </div>
            </section>
            {/* All auctions */}
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
    </div>
  );
}

export default MainPage;
