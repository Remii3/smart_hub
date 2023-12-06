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
import { CardContent, CardHeader } from '@components/UI/card';
import MainContainer from '@layout/MainContainer';
import { toast } from '@components/UI/use-toast';
import errorToast from '@components/UI/error/errorToast';
import ErrorMessage from '@components/UI/error/ErrorMessage';

interface ProductCategoriesFullTypes extends FetchDataTypes {
  data: ProductCategories[] | null;
}

export default function CategoriesSection() {
  const [categoriesList, setCategoriesList] =
    useState<ProductCategoriesFullTypes>({
      data: null,
      isLoading: false,
      hasError: null,
    });

  const fetchData = useCallback(async () => {
    setCategoriesList((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });
    if (error) {
      errorToast(error);
      return setCategoriesList((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setCategoriesList({ data, isLoading: false, hasError: null });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <MainContainer>
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
        <article className="mx-auto grid w-full grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
          {categoriesList.isLoading &&
            [...Array(6)].map((el, index) => (
              <Skeleton
                key={index}
                className="relative col-span-1 flex h-[212px] flex-col gap-4"
              >
                <CardHeader className="pb-4">
                  <Skeleton className="h-8 w-full md:w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-3 h-6 w-3/4 md:w-1/2" />
                  <Skeleton className="h-6 w-3/4 md:w-1/3" />
                </CardContent>
              </Skeleton>
            ))}
          {!categoriesList.isLoading && categoriesList.hasError && (
            <ErrorMessage message={categoriesList.hasError} />
          )}
          {!categoriesList.isLoading &&
            !categoriesList.hasError &&
            categoriesList.data &&
            categoriesList.data
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
          {!categoriesList.isLoading &&
            !categoriesList.data &&
            !categoriesList.hasError && <p>No categories</p>}
        </article>
        {!categoriesList.isLoading &&
          !categoriesList.hasError &&
          categoriesList.data && (
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
    </MainContainer>
  );
}
