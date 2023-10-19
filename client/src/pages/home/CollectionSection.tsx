import { useCallback, useEffect, useState } from 'react';
import { ProductTypes } from '@customTypes/interfaces';
import MainPageHeading from '@pages/home/MainPageHeading';
import CollectionCard from '@components/cards/CollectionCard';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { Link } from 'react-router-dom';
import { sortOptions } from '@hooks/useSortProducts';
import { Card } from '@components/UI/card';

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
      <div className="w-full bg-background">
        <MainPageHeading
          color="foreground"
          usecase="main"
          mainTitle="Discover your next great read"
          subTitle="Unleash the power of imagination, explore new worlds and find
        your next favorite book with us"
        />
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <Link to="/shop" className="block cursor-pointer sm:col-span-2">
          <Card className="space-y-10 p-10 transition-[box-shadow,transform] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100 ">
            <div className="space-y-1">
              <h3 className="pb-2 uppercase">Variety</h3>
              <p className="pb-1 text-muted-foreground">
                Genres galore, for every bookworm
              </p>
            </div>
            <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FcolectionsImg.webp?alt=media&token=7a56ac77-da7f-4b8b-b65b-396b53d5a278"
                alt="test_img"
                className="w-full object-fill object-center"
                height="900"
                width="1600"
              />
            </div>
          </Card>
        </Link>
        <Link
          to={{ pathname: '/search', search: 'special=bestseller' }}
          className="block cursor-pointer"
        >
          <Card className="space-y-10 p-10 transition-[box-shadow,transform] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100">
            <div className="space-y-1">
              <h3 className="pb-2 uppercase">Bestsellers</h3>
              <p className="pb-1 text-muted-foreground">
                The hottest literary hits
              </p>
            </div>
            <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FcolectionsImg.webp?alt=media&token=7a56ac77-da7f-4b8b-b65b-396b53d5a278"
                alt="test_img"
                className="w-full object-fill object-center"
                height="900"
                width="1600"
              />
            </div>
          </Card>
        </Link>
        <Link
          to={{
            pathname: '/search',
            search: `sort=${sortOptions.PRICE_ASC}`,
          }}
          className="block cursor-pointer"
        >
          <Card className="space-y-10 p-10 transition-[box-shadow,transform] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100">
            <div className="space-y-1">
              <h3 className="pb-2 uppercase">Deals</h3>
              <p className="pb-1 text-muted-foreground">
                Prices that’ll make you smile
              </p>
            </div>
            <div className="flex max-h-[300px] items-center overflow-hidden rounded-md">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FcolectionsImg.webp?alt=media&token=7a56ac77-da7f-4b8b-b65b-396b53d5a278"
                alt="test_img"
                className="w-full object-fill object-center"
                height="900"
                width="1600"
              />
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
}
