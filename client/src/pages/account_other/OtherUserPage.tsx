import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { AuthorTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import ShortSwiper from '@components/swiper/ShortSwiper';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import { MarketPlaceTypes, UserRoleTypes } from '@customTypes/types';
import { Skeleton } from '@components/UI/skeleton';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import MainContainer from '@layout/MainContainer';
import { useToast } from '@components/UI/use-toast';

type StatsTypes = { text: string; quantity: number }[];
interface PropsTypes {
  data: AuthorTypes | null;
  stats: StatsTypes;
  isLoading: boolean;
  hasError: null | string;
}

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<PropsTypes>({
    data: null,
    stats: [],
    isLoading: false,
    hasError: null,
  });
  const { toast } = useToast();
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const path = useLocation();
  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];

  const [isFollowing, setIsFollowing] = useState<boolean>(
    userData.data
      ? userData.data.following.some((id: string) => id === userId) || false
      : false
  );

  const getStats = (data: AuthorTypes) => {
    return (
      data.author_info && [
        {
          text: 'Products',
          quantity: data.author_info.my_products?.filter(
            (item) => item.market_place === MarketPlaceTypes.SHOP
          ).length,
        },
        {
          text: 'Collections',
          quantity: data.author_info.my_products?.filter(
            (item) => item.market_place === MarketPlaceTypes.COLLECTION
          ).length,
        },
        {
          text: 'Followers',
          quantity: data.author_info.followers.length,
        },
      ]
    );
  };

  const getOtherUserData = useCallback(async () => {
    setOtherUserData((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_OTHER_PROFILE,
      params: { userId },
    });

    if (error) {
      setOtherUserData((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });

      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error,
      });
    }

    const stats = getStats(data);

    setOtherUserData({ data, stats, isLoading: false, hasError: null });

    if (data && data.role !== 'User') {
      setIsFollowing(
        data.author_info.followers.some(
          (id: string) => id === userData.data?._id
        ) || false
      );
    }
  }, []);

  useEffect(() => {
    if (userId === userData.data?._id) {
      return navigate('/account/my', { replace: true });
    }
    getOtherUserData();
  }, [getOtherUserData]);

  const followHandler = async () => {
    if (userData.data === null) return;
    if (isFollowing) {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_REMOVE,
        body: {
          followReceiverId: userId,
          followGiverId: userData.data._id,
        },
      });
      if (error) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error,
        });
      }
      await getOtherUserData();
    } else {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_ADD,
        body: {
          followReceiverId: userId,
          followGiverId: userData.data._id,
        },
      });
      if (error) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error,
        });
      }
      await getOtherUserData();
    }
  };

  return (
    <MainContainer>
      {otherUserData.isLoading && !otherUserData.data && (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4 px-8 pb-16 pt-12">
          <Skeleton className="h-36 w-36 rounded-full bg-slate-200" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px] bg-slate-200" />
            <Skeleton className="h-4 w-[200px] bg-slate-200" />
            <Skeleton className="h-4 w-[250px] bg-slate-200" />
            <div className="pt-4">
              <Skeleton className="mx-auto h-[34px] w-[94px] bg-slate-200" />
            </div>
          </div>
        </div>
      )}
      {!otherUserData.isLoading && otherUserData.hasError && (
        <div>{otherUserData.hasError}</div>
      )}
      {!otherUserData.isLoading && otherUserData.data && (
        <>
          <section className="flex items-center justify-center px-8 pb-16 pt-12">
            <div className="flex flex-col items-center justify-center rounded-md ">
              <div className="mb-4">
                {otherUserData.data.user_info.profile_img.url ? (
                  <img
                    src={otherUserData.data.user_info.profile_img.url}
                    className="aspect-auto h-36 w-36 rounded-full object-cover"
                    alt="profile_img"
                  />
                ) : (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                    className="aspect-auto h-36 w-36 rounded-full object-cover"
                    alt="profile_img"
                  />
                )}
              </div>
              <h3 className="mb-4">
                {otherUserData.data.author_info
                  ? otherUserData.data.author_info.pseudonim
                  : otherUserData.data.user_info.credentials.full_name}
              </h3>
              <div className="mb-8 flex gap-8">
                {otherUserData.stats.map((field, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p>{field.text}</p>
                    <span>{field.quantity}</span>
                  </div>
                ))}
              </div>
              <div>
                <Button
                  variant={isFollowing ? 'outline' : 'default'}
                  disabled={userData.data === null}
                  onClick={() => followHandler()}
                  className="relative w-[96px] transition-all ease-out"
                >
                  <div
                    className={`${
                      isFollowing ? 'hover:opacity-100' : 'opacity-0'
                    } absolute flex h-full w-full items-center justify-center bg-accent text-red-600 opacity-0 transition-opacity ease-out`}
                  >
                    Unfollow
                  </div>
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          </section>

          {otherUserData.data.role !== UserRoleTypes.USER && (
            <section className="mb-8">
              <div className="">
                <h4 className="mb-5">Products</h4>
                {otherUserData.data.author_info.my_products.length > 0 ? (
                  <ShortSwiper swiperCategory="product">
                    {otherUserData.data.author_info.my_products.map(
                      (product) => {
                        return (
                          product.market_place === MarketPlaceTypes.SHOP && (
                            <SwiperSlide key={product._id} className="pr-8">
                              <ShopCard
                                _id={product._id}
                                title={product.title}
                                authors={product.authors}
                                description={product.description}
                                price={product.shop_info.price}
                                img={product.imgs && product.imgs[0]}
                                productQuantity={product.quantity}
                                rating={product.rating}
                              />
                            </SwiperSlide>
                          )
                        );
                      }
                    )}
                  </ShortSwiper>
                ) : (
                  <p className="text-slate-400">No products...</p>
                )}
              </div>
              <div className="relative max-w-[1092px]">
                <h4 className="mb-5">Collections</h4>
                <p>TODO: ADD COLLECTIONS</p>
              </div>
            </section>
          )}
        </>
      )}
    </MainContainer>
  );
}
