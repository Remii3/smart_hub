import axios from 'axios';
import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { AuthorTypes } from '../types/interfaces';
import ShopCard from '../components/card/ShopCard';
import AuctionCard from '../components/card/AuctionCard';
import ShortSwiper from '../components/swiper/ShortSwiper';
import { UserContext } from '../context/UserProvider';
import { Button } from '../components/UI/Btns/Button';

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<AuthorTypes>();
  const [isFollowing, setIsFollowing] = useState(false);
  const path = useLocation();

  const { userData } = useContext(UserContext);

  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];

  const getOtherUserData = useCallback(() => {
    axios
      .get('/user/otherUser', { params: { userId } })
      .then((data) => setOtherUserData(data.data));
  }, [userId]);

  useEffect(() => {
    getOtherUserData();
  }, [getOtherUserData, userId, isFollowing]);

  useEffect(() => {
    if (userData && userData.following.find((user) => user._id === userId)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [getOtherUserData, userData, userId]);

  const shopProducts = otherUserData?.author_info.my_products.filter(
    (item) => item.market_place === 'Shop'
  );

  const auctionProducts = otherUserData?.author_info.my_products.filter(
    (item) => item.market_place === 'Auction'
  );

  const otherUserStats = [
    { text: 'Products', quantity: shopProducts?.length },
    { text: 'Auctions', quantity: auctionProducts?.length },
    {
      text: 'Followers',
      quantity: otherUserData?.author_info.followers.length,
    },
  ];

  const followHandler = () => {
    if (userData === null) return;
    if (isFollowing) {
      axios
        .post('/user/remove-follow', {
          followReceiverId: userId,
          followGiverId: userData._id,
        })
        .then(() => {
          setIsFollowing(false);
          getOtherUserData();
        });
    } else {
      axios
        .post('/user/add-follow', {
          followReceiverId: userId,
          followGiverId: userData._id,
        })
        .then(() => {
          setIsFollowing(true);
          getOtherUserData();
        });
    }
  };
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
            {otherUserStats.map((field, i) => (
              <div key={i}>
                <p>{field.text}</p>
                <span>{field.quantity}</span>
              </div>
            ))}
          </div>
          <div>
            <Button
              variant="primary"
              isDisabled={userData === null ? 'yes' : 'no'}
              disabled={userData === null}
              onClick={() => followHandler()}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </section>
      <section className="max-w-7xl">
        <div className="max-w-[1092px]">
          <h6 className="mb-5">Products</h6>
          <ShortSwiper swiperCategory="product">
            {shopProducts?.map((product) => (
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
            ))}
          </ShortSwiper>
        </div>
        <div className="relative max-w-[1092px]">
          <h6 className="mb-5">Auctions</h6>
          <ShortSwiper swiperCategory="auction">
            {auctionProducts?.map((item) => (
              <SwiperSlide
                key={item._id}
                style={{ maxWidth: '', margin: '0 auto' }}
              >
                <AuctionCard
                  _id={item._id}
                  title={item.title}
                  authors={item.authors}
                  description={item.description}
                  img={item.img}
                  auctionEndDate={item.auction_info.auction_end_date}
                  currentPrice={item.auction_info.current_price}
                  startingPrice={item.auction_info.starting_price}
                />
              </SwiperSlide>
            ))}
          </ShortSwiper>
        </div>
      </section>
    </div>
  );
}
