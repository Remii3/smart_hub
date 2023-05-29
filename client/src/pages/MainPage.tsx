import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import CollectionCard from '../components/card/CollectionCard';
import CategoryCard from '../components/card/ShopCategoryCard';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import MainPageHeading from '../components/UI/MainPageHeading';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';

import '../assets/styles/swiper.css';
import { ProductTypes, ProductCategories } from '../types/interfaces';
import SpecialAuctionsSwiper from '../components/swiper/SpecialAuctionsSwiper';
import AuctionsSwiper from '../components/swiper/AuctionsSwiper';

function MainPage() {
  const [shopList, setShopList] = useState<ProductCategories[]>([]);
  const [collection, setCollection] = useState<ProductTypes[]>([]);
  const imgBg = useRef(null);

  const navigate = useNavigate();

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.to(imgBg.current, {
      scrollTrigger: {
        scrub: 1,
      },
      duration: 0.5,
      scale: '1.25',
      ease: 'sine.out',
    });

    try {
      axios.get('/product/categories-get').then((res) => {
        setShopList(res.data);
      });
    } catch (err) {
      console.error(err);
    }
    try {
      axios.get('/product/all-get').then((res) => {
        setCollection(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-pageBackground">
      <section className="h-screen w-full">
        <div
          ref={imgBg}
          className="absolute left-0 top-0 h-[110vh] w-full scale-100 bg-mainBanner bg-cover bg-center bg-no-repeat brightness-50"
        />
        <section className="relative top-20 lg:-top-16">
          <div className="mx-auto max-w-screen-xl px-4 py-[20%] sm:py-32 lg:flex lg:h-screen lg:items-center">
            <div
              id="mainPageTitle"
              className="mx-auto max-w-xl text-center lg:max-w-3xl"
            >
              <h1 className=" font-extrabold text-white ">
                Understand User Flow.
                <strong className="font-extrabold text-primary sm:block">
                  Increase Conversion.
                </strong>
              </h1>

              <p className="mt-4 text-white sm:text-xl/relaxed">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Nesciunt illo tenetur fuga ducimus numquam ea!
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/"
                  className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm
                  transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300 sm:w-auto"
                >
                  Get Started
                </Link>
                <Link
                  //
                  // className="block w-full px-12 py-3 text-sm font-medium text-white underline underline-offset-4  hover:text-primary focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                  className="block rounded border border-white px-5 py-3 text-sm text-white transition hover:ring-1 hover:ring-white"
                  to="/"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white ">
        {/* Shop */}
        <section className="relative flex w-full flex-col items-center gap-12 pb-16">
          <div className="relative -top-4 left-0 w-full bg-pageBackground">
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
                  _id={cardItem._id}
                  name={cardItem.name}
                  description={cardItem.description}
                />
              ))}
            </div>
          </div>
          <div className="w-full text-center">
            <PrimaryBtn
              usecase="default"
              type="button"
              onClick={() => {
                navigate('/shop/categories');
              }}
            >
              See all genres
            </PrimaryBtn>
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
            {/* {collection.slice(0, 4).map((collection_data, id) => (
                <CollectionCard
                  key={collection_data._id}
                  backcolor={(id + 1) % 2 ? 'pageBackground' : 'white'}
                  collectionData={collection_data}
                  lastItem={collection.length === id + 1}
                />
              ))} */}
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
      </div>
    </div>
  );
}

export default MainPage;
