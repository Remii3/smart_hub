import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ProductTypes } from '@customTypes/interfaces';
import MainPageHeading from '@features/headings/MainPageHeading';
import CollectionCard from '@components/cards/CollectionCard';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { Link } from 'react-router-dom';
import { sortOptions } from '@hooks/useSortProducts';

export default function CollectionSection() {
  const [collection, setCollection] = useState<ProductTypes[]>([]);

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ALL,
    });
    setCollection(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="relative flex w-full max-w-7xl flex-col items-center gap-12 px-3 pb-16">
      <div className="w-full bg-white">
        <MainPageHeading
          color="dark"
          usecase="main"
          mainTitle="Discover your next great read"
          subTitle="Unleash the power of imagination, explore new worlds and find
        your next favorite book with us"
        />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/shop"
          className="block cursor-pointer space-y-10 rounded-xl bg-gray900 p-10 shadow-sm transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100 sm:col-span-2"
        >
          <div className="space-y-1">
            <h4 className="pb-2 uppercase">Variety</h4>
            <p className="pb-1 text-gray500">
              Genres galore, for every bookworm
            </p>
          </div>
          <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
            <img
              src="https://wallpapers.com/images/hd/black-and-white-long-boardwalk-dgva6b5fa6cmynyb.webp"
              alt="test_img"
              className="w-full object-fill object-center"
            />
          </div>
        </Link>
        <Link
          to={{ pathname: '/search', search: 'special=bestseller' }}
          className="block cursor-pointer space-y-10 rounded-xl bg-gray900 p-10 shadow-sm transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100"
        >
          <div className="space-y-1">
            <h4 className="pb-2 uppercase">Bestsellers</h4>
            <p className="pb-1 text-gray500">The hottest literary hits</p>
          </div>
          <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
            <img
              src="https://wallpapers.com/images/hd/black-and-white-long-boardwalk-dgva6b5fa6cmynyb.webp"
              alt="test_img"
              className="w-full object-fill object-center"
            />
          </div>
        </Link>
        <Link
          to={{
            pathname: '/search',
            search: `sort=${sortOptions.PRICE_ASC}`,
          }}
          className="block cursor-pointer space-y-10 rounded-xl bg-gray900 p-10 shadow-sm transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100"
        >
          <div className="space-y-1">
            <h4 className="pb-2 uppercase">Deals</h4>
            <p className="pb-1 text-gray500">Prices that’ll make you smile</p>
          </div>
          <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
            <img
              src="https://wallpapers.com/images/hd/black-and-white-long-boardwalk-dgva6b5fa6cmynyb.webp"
              alt="test_img"
              className="w-full object-fill object-center"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
