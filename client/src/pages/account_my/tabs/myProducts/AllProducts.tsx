import { useCallback, useEffect, useState } from 'react';
import { FetchDataTypes, ProductTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import Pagination from '@components/paginations/Pagination';

interface PropsTypes {
  limit: number;
}

interface ProductsTypes extends FetchDataTypes {
  data: null | ProductTypes[];
  rawData: null | any;
}

export default function AllProducts({ limit }: PropsTypes) {
  const [products, setProducts] = useState<ProductsTypes>({
    data: null,
    rawData: null,
    hasError: null,
    isLoading: false,
  });
  const [page, setPage] = useState(1);
  const fetchData = useCallback(async () => {
    setProducts((prevState) => {
      return { ...prevState, isLoading: true };
    });

    let data = null;
    let error = null;

    const productsResponse = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.SEARCH_PRODCOL,
      params: {
        pageSize: limit,
        withPagination: true,
        filtersData: {
          page,
          marketplace: 'shop',
        },
      },
    });
    data = productsResponse.data;
    error = productsResponse.error;
    if (error) {
      errorToast(error);
      return setProducts({
        data: null,
        rawData: null,
        hasError: error,
        isLoading: false,
      });
    }
    setProducts({
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
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.data &&
          products.data.map((product) => {
            return (
              <ShopCard
                key={product._id}
                _id={product._id}
                categories={product.categories}
                price={product.price.value}
                productQuantity={product.quantity}
                title={product.title}
                authors={product.authors}
                shortDescription={product.shortDescription}
                type={product.marketplace}
                img={
                  (product.imgs &&
                    product.imgs.length > 0 &&
                    product.imgs[0].url) ||
                  null
                }
                rating={product.rating}
              />
            );
          })}
      </div>
      {limit && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            pageSize={limit}
            onPageChange={(newPageNumber: number) =>
              changeCurrentPageHandler(newPageNumber)
            }
            totalCount={products.rawData && products.rawData.totalProducts}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
}