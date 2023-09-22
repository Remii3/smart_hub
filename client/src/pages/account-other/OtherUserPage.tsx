import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { AuthorTypes } from '@customTypes/interfaces';
import ShopCard from '@components/cards/ShopCard';
import AuctionCard from '@components/cards/AuctionCard';
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

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<AuthorTypes>();

  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

  const path = useLocation();
  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];

  const [isFollowing, setIsFollowing] = useState<boolean>(
    userData
      ? userData.following.some((id: string) => id === userId) || false
      : false
  );

  const getOtherUserData = useCallback(async () => {
    if (userId !== userData?._id) {
      const { data } = await useGetAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_OTHER_PROFILE,
        params: { userId },
      });
      setOtherUserData(data);
      if (data) {
        setIsFollowing(
          data.author_info.followers.some(
            (id: string) => id === userData?._id
          ) || false
        );
      }
    }
  }, [userData?._id, userId]);

  useEffect(() => {
    getOtherUserData();
  }, [getOtherUserData]);

  useEffect(() => {
    if (userId === userData?._id) {
      navigate('/account/my', { replace: true });
    }
  }, []);

  const otherUserStats = otherUserData?.author_info
    ? [
        {
          text: 'Products',
          quantity: otherUserData?.author_info.my_products?.filter(
            (item) => item.market_place === MarketPlaceTypes.SHOP
          ).length,
        },
        {
          text: 'Auctions',
          quantity: otherUserData?.author_info.my_products?.filter(
            (item) => item.market_place === MarketPlaceTypes.AUCTION
          ).length,
        },
        {
          text: 'Followers',
          quantity: otherUserData?.author_info.followers.length,
        },
      ]
    : null;

  const followHandler = async () => {
    if (userData === null) return;
    if (isFollowing) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_REMOVE,
        body: {
          followReceiverId: userId,
          followGiverId: userData._id,
        },
      });

      await getOtherUserData();
    } else {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_ADD,
        body: {
          followReceiverId: userId,
          followGiverId: userData._id,
        },
      });
      await getOtherUserData();
    }
  };

  if (!userData)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-slate-200" />
          <Skeleton className="h-4 w-[200px] bg-slate-200" />
          <Skeleton className="h-4 w-[250px] bg-slate-200" />
          <Skeleton className="h-4 w-[200px] bg-slate-200" />
        </div>
      </div>
    );

  return (
    <div className="mx-auto flex max-w-[1900px] flex-col gap-5 p-5 lg:items-center lg:justify-center xl:flex-row">
      <section className="flex w-1/2 basis-1/2 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded p-5 shadow">
          <div>profileImg</div>
          <h6>
            {otherUserData?.user_info.credentials.first_name}{' '}
            {otherUserData?.user_info.credentials.last_name}
          </h6>
          <p>
            {otherUserData?.user_info.address.city}
            {otherUserData?.user_info.address.country}
          </p>
          <div className="flex gap-4">
            {otherUserStats &&
              otherUserStats.map((field, i) => (
                <div key={i}>
                  <p>{field.text}</p>
                  <span>{field.quantity}</span>
                </div>
              ))}
          </div>
          <div>
            <Button
              variant="default"
              disabled={userData === null}
              onClick={() => followHandler()}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </section>

      {otherUserData?.role !== UserRoleTypes.USER && (
        <section className="w-full max-w-7xl space-y-4">
          <div className="max-w-[1092px]">
            <h5 className="mb-5">Products</h5>
            {otherUserData?.author_info.my_products &&
            otherUserData?.author_info.my_products.length > 0 ? (
              <ShortSwiper swiperCategory="product">
                {otherUserData?.author_info.my_products?.map((product) => {
                  return (
                    product.market_place === MarketPlaceTypes.SHOP && (
                      <SwiperSlide
                        key={product._id}
                        style={{ maxWidth: '', margin: '0 auto' }}
                      >
                        <ShopCard
                          _id={product._id}
                          title={product.title}
                          authors={product.authors}
                          description={product.description}
                          price={product.shop_info.price}
                          img={product.img}
                          productQuantity={product.quantity}
                        />
                      </SwiperSlide>
                    )
                  );
                })}
              </ShortSwiper>
            ) : (
              <p className="text-slate-400">No products...</p>
            )}
          </div>
          <div className="relative max-w-[1092px]">
            <h5 className="mb-5">Auctions</h5>
            {otherUserData?.author_info.my_products &&
            otherUserData?.author_info.my_products.length > 0 ? (
              <ShortSwiper swiperCategory="auction">
                {otherUserData?.author_info.my_products?.map((product) => {
                  return (
                    product.market_place === MarketPlaceTypes.AUCTION && (
                      <SwiperSlide
                        key={product._id}
                        style={{ maxWidth: '', margin: '0 auto' }}
                      >
                        <AuctionCard
                          _id={product._id}
                          title={product.title}
                          authors={product.authors}
                          description={product.description}
                          img={product.img}
                          auctionEndDate={product.auction_info.auction_end_date}
                          currentPrice={product.auction_info.current_price}
                          startingPrice={product.auction_info.starting_price}
                        />
                      </SwiperSlide>
                    )
                  );
                })}
              </ShortSwiper>
            ) : (
              <p className="text-slate-400">No auctions...</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
