import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainPageHeading from '@pages/home/MainPageHeading';
import CategoryCard from '@components/cards/CategoryCard';
import { FetchDataTypes, ProductCategories } from '@customTypes/interfaces';
import { buttonVariants } from '@components/UI/button';
import { Skeleton } from '@components/UI/skeleton';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { sortOptions } from '@hooks/useSortProducts';

interface ProductCategoriesFullTypes extends FetchDataTypes {
  data: ProductCategories[] | null;
}

export default function CategoriesSection() {
  const [shopList, setShopList] = useState<ProductCategoriesFullTypes>({
    data: null,
    isLoading: false,
    hasError: null,
  });

  const fetchData = useCallback(async () => {
    setShopList((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });
    if (error) {
      return setShopList((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setShopList({ data, isLoading: false, hasError: null });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="relative flex w-full flex-col items-center gap-12 pb-16">
      <header className="relative left-0 top-0 w-full ">
        <MainPageHeading
          color="foreground"
          usecase="main"
          mainTitle="Reading with us is easy"
          subTitle="Offering a diverse array of book genres to choose from, for
                every occasion"
        />
      </header>
      <article className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
        {shopList.isLoading &&
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
        {!shopList.isLoading && shopList.hasError && (
          <div>
            <strong className="font-semibold">Error</strong>
            <p>Couldn't get the categories</p>
          </div>
        )}
        {!shopList.isLoading && !shopList.data && !shopList.hasError && (
          <p>No categories</p>
        )}
        {!shopList.isLoading &&
          shopList.data &&
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
      </article>
      {!shopList.isLoading && !shopList.hasError && shopList.data && (
        <footer className="w-full text-center">
          <Link
            to={{
              pathname: '/search',
              search: `sort=${sortOptions.PRICE_ASC}`,
            }}
            className={buttonVariants({ variant: 'default' })}
          >
            Show more
          </Link>
        </footer>
      )}
    </section>
  );
}
