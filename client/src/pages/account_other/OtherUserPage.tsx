import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { AuthorTypes, FetchDataTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import ShortSwiper from '@components/swiper/SushiSwiper';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import { MarketplaceTypes, UserRoleTypes } from '@customTypes/types';
import { Skeleton } from '@components/UI/skeleton';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import MainContainer from '@layout/MainContainer';
import { useToast } from '@components/UI/use-toast';
import SushiSwiper from '@components/swiper/SushiSwiper';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
const marketplaces = { shop: 'Shop', collection: 'Collection' } as {
  shop: MarketplaceTypes;
  collection: MarketplaceTypes;
};
type StatsTypes = { text: string; quantity: number }[];
interface PropsTypes extends FetchDataTypes {
  data: AuthorTypes | null;
  stats: StatsTypes;
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
            (item) => item.market_place === marketplaces.shop
          ).length,
        },
        {
          text: 'Collections',
          quantity: data.author_info.my_products?.filter(
            (item) => item.market_place === marketplaces.collection
          ).length,
        },
        {
          text: 'Followers',
          quantity: data.author_info.followers.length,
        },
      ]
    );
  };
  const getFollowersHandler = async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_OTHER_PROFILE,
      params: { userId },
    });

    const stats = getStats(data);
    if (data && data.role !== 'User') {
      setIsFollowing(
        data.author_info.followers.some(
          (id: string) => id === userData.data?._id
        ) || false
      );
    }
    setOtherUserData((prevState) => {
      return { ...prevState, stats };
    });
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
      await getFollowersHandler();
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
      await getFollowersHandler();
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
                {otherUserData.data.user_info &&
                otherUserData.data.user_info.profile_img.url ? (
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
              <MarketplaceBadge
                message={otherUserData.data.role}
                color={
                  otherUserData.data.role === 'Author'
                    ? 'text-purple-700'
                    : 'text-cyan-700'
                }
                bgColor={
                  otherUserData.data.role === 'Author'
                    ? 'bg-purple-100'
                    : 'bg-cyan-100'
                }
              />
              <h3 className="mb-4">
                {otherUserData.data.author_info
                  ? otherUserData.data.author_info.pseudonim
                  : otherUserData.data.username}
              </h3>
              {otherUserData.data.user_info && (
                <article>
                  {otherUserData.data.user_info.credentials.first_name && (
                    <div>
                      First name:{' '}
                      <span>
                        {otherUserData.data.user_info.credentials.first_name}
                      </span>
                    </div>
                  )}
                  {otherUserData.data.user_info.credentials.last_name && (
                    <div>
                      Last name:{' '}
                      <span>
                        {otherUserData.data.user_info.credentials.last_name}
                      </span>
                    </div>
                  )}
                </article>
              )}
              {otherUserData.data.user_info &&
                otherUserData.data.role !== UserRoleTypes.USER && (
                  <article>
                    {otherUserData.data.author_info.quote && (
                      <div>
                        Favourite quote:{' '}
                        <span>{otherUserData.data.author_info.quote}</span>
                      </div>
                    )}
                    {otherUserData.data.author_info.short_description && (
                      <div>
                        Short description:{' '}
                        <span>
                          {otherUserData.data.author_info.short_description}
                        </span>
                      </div>
                    )}
                  </article>
                )}
              {otherUserData.data.role !== UserRoleTypes.USER && (
                <>
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
                      type="button"
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
                </>
              )}
            </div>
          </section>

          {otherUserData.data.role !== UserRoleTypes.USER && (
            <section className="mb-8">
              <div className="">
                <h4 className="mb-5">Products</h4>
                <SushiSwiper
                  swiperCategory="shop"
                  itemsType="Shop"
                  loadingState={otherUserData.isLoading}
                  errorState={otherUserData.hasError}
                  arrayOfItems={otherUserData.data.author_info.my_products}
                />
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
