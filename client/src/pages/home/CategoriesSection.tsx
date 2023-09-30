import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainPageHeading from '@pages/home/MainPageHeading';
import CategoryCard from '@components/cards/CategoryCard';
import { ProductCategories } from '@customTypes/interfaces';
import { buttonVariants } from '@components/UI/button';
import { Skeleton } from '@components/UI/skeleton';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';

interface ProductCategoriesFullTypes {
  data: ProductCategories[] | null;
  isLoading: boolean;
}

export default function CategoriesSection() {
  const [shopList, setShopList] = useState<ProductCategoriesFullTypes>({
    data: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setShopList((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });

    setShopList({ data, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="relative flex w-full flex-col items-center gap-12 pb-16">
      <div className="relative left-0 top-0 w-full ">
        <MainPageHeading
          color="foreground"
          usecase="main"
          mainTitle="Reading with us is easy"
          subTitle="Offering a diverse array of book genres to choose from, for
                every occasion"
        />
      </div>
      <div className="w-full">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
          {shopList.isLoading &&
            !shopList.data &&
            [...Array(6)].map((el, index) => (
              <Skeleton
                key={index}
                className="relative h-full flex-col gap-4 rounded-lg px-10 py-12"
              >
                <Skeleton className="h-5 w-1/2 md:w-1/4" />
                <div className="mt-4 space-y-1">
                  <Skeleton className="h-3 w-full md:w-3/4" />
                  <Skeleton className="h-3 w-3/4 md:w-1/2" />
                </div>
              </Skeleton>
            ))}
          {!shopList.isLoading && !shopList.data && <p>No categories</p>}
          {shopList.data &&
            !shopList.isLoading &&
            shopList.data
              .slice(0, 6)
              .map((cardItem) => (
                <CategoryCard
                  key={cardItem._id}
                  _id={cardItem._id}
                  label={cardItem.label}
                  value={cardItem.value}
                  description={cardItem.description}
                />
              ))}
        </div>
      </div>
      <div className="w-full text-center">
        <Link
          to="/shop/categories"
          className={buttonVariants({ variant: 'default' })}
        >
          Show more
        </Link>
      </div>
    </section>
  );
}
