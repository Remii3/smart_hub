import errorToast from '@components/UI/error/errorToast';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { FetchDataTypes, ProductTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
interface ProductsTypes extends FetchDataTypes {
  data: null | ProductTypes[];
}
interface PropsTypes {
  authorId: string;
  authorPseudonim: string;
}
export default function SimilarProducts({ authorId }: PropsTypes) {
  const [products, setProducts] = useState<ProductsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setProducts((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ALL,
      params: { authorId, limit: 10, withHighPrice: true },
    });
    if (error) {
      errorToast(error);
      return setProducts({ data: null, hasError: error, isLoading: false });
    }
    setProducts({ data: data.data, hasError: null, isLoading: false });
  }, [authorId]);

  useEffect(() => {
    fetchData();
  }, [authorId]);

  return (
    <article>
      {products.data && (
        <SushiSwiper
          arrayOfItems={products.data}
          errorState={products.hasError}
          swiperCategory={`similarProducts`}
          loadingState={products.isLoading}
        />
      )}
    </article>
  );
}
