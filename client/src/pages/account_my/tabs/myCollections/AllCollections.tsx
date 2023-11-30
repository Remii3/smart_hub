import errorToast from '@components/UI/error/errorToast';
import ShopCard from '@components/cards/ShopCard';
import Pagination from '@components/paginations/Pagination';
import { FetchDataTypes, ProductTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';

interface ProductsTypes extends FetchDataTypes {
  data: null | ProductTypes[];
  rawData: null | any;
}

export default function AllCollectionsList({ limit }: { limit?: number }) {
  const [collections, setCollections] = useState<ProductsTypes>({
    data: null,
    rawData: null,
    hasError: null,
    isLoading: false,
  });
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setCollections((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.SEARCH_PRODCOL,
      params: {
        pageSize: limit,

        filtersData: {
          page,
          marketplace: 'collection',
        },
        withPagination: true,
      },
    });
    if (error) {
      errorToast(error);
      return setCollections({
        data: null,
        hasError: error,
        rawData: null,
        isLoading: false,
      });
    }
    setCollections({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const changeCurrentPageHandler = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      {collections.data &&
        collections.data.length > 0 &&
        !collections.hasError &&
        !collections.isLoading && (
          <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.data.map((collection) => (
              <ShopCard
                key={collection._id}
                _id={collection._id}
                title={collection.title}
                price={collection.price.value}
                rating={collection.rating}
                img={
                  collection.imgs && collection.imgs.length > 0
                    ? collection.imgs[0].url
                    : ''
                }
                shortDescription={collection.shortDescription}
                authors={collection.authors}
                categories={collection.categories}
                type="collection"
                productQuantity={collection.quantity}
              />
            ))}
          </div>
        )}

      {limit && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            pageSize={limit}
            onPageChange={(newPageNumber: number) =>
              changeCurrentPageHandler(newPageNumber)
            }
            totalCount={
              collections.rawData && collections.rawData.totalProducts
            }
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
}
