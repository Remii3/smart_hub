import { useEffect, useState, useCallback, useContext } from 'react';
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
import { UserContext } from '@context/UserProvider';
import { useNavigate } from 'react-router-dom';

export type OtherUserTypes = Pick<
  AuthorTypes,
  '_id' | 'username' | 'role' | 'securitySettings' | 'authorInfo' | 'userInfo'
>;
export interface OtherUserDataTypes extends FetchDataTypes {
  data: OtherUserTypes | null;
  productsData: ProductTypes[] | null;
}

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<OtherUserDataTypes>({
    data: null,
    productsData: null,
    isLoading: false,
    hasError: null,
  });

  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
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

    setOtherUserData({
      data: data.otherUserData,
      productsData: data.otherUserProductsData,
      isLoading: false,
      hasError: null,
    });
  }, []);

  useEffect(() => {
    if (userData.data && userData.data._id === otherUserId) {
      navigate('/account/my');
    } else {
      getOtherUserData();
    }
  }, [userData.data]);

  return (
    <>
      {otherUserData.isLoading && <LoadingCircle />}
      {!otherUserData.isLoading && otherUserData.hasError && (
        <ErrorMessage message={otherUserData.hasError} />
      )}

      {!otherUserData.isLoading &&
        !otherUserData.hasError &&
        otherUserData.data && (
          <>
            <OtherUserInfo
              otherUserData={otherUserData.data}
              collectionsCount={
                otherUserData.productsData
                  ? otherUserData.productsData.filter(
                      (item) => item.marketplace === 'collection'
                    ).length
                  : 0
              }
              productsCount={
                otherUserData.productsData
                  ? otherUserData.productsData.filter(
                      (item) => item.marketplace === 'shop'
                    ).length
                  : 0
              }
            />

            {otherUserData.data.role !== UserRoleTypes.USER && (
              <section>
                <h4 className="mb-4">Products</h4>
                <SushiSwiper
                  swiperCategory="shop"
                  loadingState={otherUserData.isLoading}
                  errorState={otherUserData.hasError}
                  arrayOfItems={
                    otherUserData.productsData &&
                    otherUserData.productsData.filter(
                      (item) => item.marketplace === 'shop'
                    )
                  }
                />
                <h4 className="mb-4">Collections</h4>
                <SushiSwiper
                  swiperCategory="shop"
                  loadingState={otherUserData.isLoading}
                  errorState={otherUserData.hasError}
                  arrayOfItems={
                    otherUserData.productsData &&
                    otherUserData.productsData.filter(
                      (item) => item.marketplace === 'collection'
                    )
                  }
                />
              </section>
            )}
          </>
        )}
    </>
  );
}
