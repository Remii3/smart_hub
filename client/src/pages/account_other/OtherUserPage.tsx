import { useEffect, useState, useCallback } from 'react';
import {
  AuthorTypes,
  FetchDataTypes,
  ProductTypes,
} from '@customTypes/interfaces';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import SushiSwiper from '@components/swiper/SushiSwiper';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import errorToast from '@components/UI/error/errorToast';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import OtherUserInfo from './parts/OtherUserInfo';
import { UserRoleTypes } from '@customTypes/types';

export type OtherUserTypes = Pick<
  AuthorTypes,
  | '_id'
  | 'username'
  | 'role'
  | 'security_settings'
  | 'author_info'
  | 'user_info'
>;
export interface OtherUserDataTypes extends FetchDataTypes {
  data: OtherUserTypes | null;
}

interface OtherUserProductsTypes extends FetchDataTypes {
  data: null | ProductTypes[];
  rawData: null | {
    [index: string]: unknown;
  };
}

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<OtherUserDataTypes>({
    data: null,
    isLoading: false,
    hasError: null,
  });

  const [otherUserProducts, setOtherUserProducts] =
    useState<OtherUserProductsTypes>({
      data: null,
      rawData: null,
      hasError: null,
      isLoading: false,
    });

  const otherUserId = window.location.href.split('/').at(-1);

  const getOtherUserData = useCallback(async () => {
    setOtherUserData((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_OTHER_PROFILE,
      params: { userId: otherUserId },
    });

    if (error) {
      errorToast(error);
      return setOtherUserData((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }

    setOtherUserData({ data, isLoading: false, hasError: null });
  }, []);

  const getOtherUserProducts = useCallback(async () => {
    setOtherUserProducts((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.SEARCH_PRODCOL,
      params: { userId: otherUserId },
    });

    if (error) {
      errorToast(error);
      return setOtherUserProducts((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setOtherUserProducts({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    getOtherUserData();
    getOtherUserProducts();
  }, []);

  return (
    <div className="relative">
      {otherUserData.isLoading && <LoadingCircle />}
      {!otherUserData.isLoading && otherUserData.hasError && (
        <ErrorMessage message={otherUserData.hasError} />
      )}

      {!otherUserData.isLoading &&
        !otherUserData.hasError &&
        otherUserData.data && (
          <>
            <section className="flex items-center justify-center px-8 pb-16 pt-12">
              <OtherUserInfo otherUserData={otherUserData.data} />
            </section>

            {otherUserData.data.role !== UserRoleTypes.USER && (
              <section className="mb-8">
                <div className="">
                  <h4 className="mb-5">Products</h4>
                  <SushiSwiper
                    swiperCategory="shop"
                    loadingState={otherUserData.isLoading}
                    errorState={otherUserData.hasError}
                    arrayOfItems={
                      otherUserProducts.data &&
                      otherUserProducts.data.filter(
                        (item) => item.marketplace === 'shop'
                      )
                    }
                  />
                </div>
                <div className="relative max-w-[1092px]">
                  <h4 className="mb-5">Collections</h4>
                  <SushiSwiper
                    swiperCategory="shop"
                    loadingState={otherUserData.isLoading}
                    errorState={otherUserData.hasError}
                    arrayOfItems={
                      otherUserProducts.data &&
                      otherUserProducts.data.filter(
                        (item) => item.marketplace === 'collection'
                      )
                    }
                  />
                </div>
              </section>
            )}
          </>
        )}
    </div>
  );
}
