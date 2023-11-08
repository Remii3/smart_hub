import errorToast from '@components/UI/error/errorToast';
import ShopCard from '@components/cards/ShopCard';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { FetchDataTypes, ShopProductTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
interface ProductsTypes extends FetchDataTypes {
  data: null | ShopProductTypes[];
}
interface PropsTypes {
  authorId: string;
  authorPseudonim: string;
}
export default function SimilarProducts({
  authorId,
  authorPseudonim,
}: PropsTypes) {
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
      url: DATABASE_ENDPOINTS.PRODUCT_SHOP_ALL,
      params: { authorId, limit: 10 },
    });
    if (error) {
      errorToast(error);
      return setProducts({ data: null, hasError: error, isLoading: false });
    }
    setProducts({ data: data.data, hasError: null, isLoading: false });
  }, [authorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <h2 className="mb-4 text-3xl">Similar products from {authorPseudonim}</h2>
      <section className="px-2">
        {products.data && (
          <SushiSwiper
            arrayOfItems={products.data}
            errorState={products.hasError}
            itemsType={'Shop'}
            swiperCategory={`similar-${authorPseudonim}`}
            loadingState={products.isLoading}
          />
        )}
      </section>
    </div>
  );
}
