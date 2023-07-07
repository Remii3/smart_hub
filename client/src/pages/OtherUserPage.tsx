import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { ProductTypes } from '../types/interfaces';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import ProductCard from '../components/card/ProductCard';
import AuctionCard from '../components/card/AuctionCard';
import ShortSwiper from '../components/swiper/ShortSwiper';
import { UserContext } from '../context/UserProvider';

type OtherUserDataType = {
  email: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  credentials: { firstName: string; lastName: string };
  my_products: ProductTypes[];
};

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState<OtherUserDataType>();
  const [isFollowing, setIsFollowing] = useState(false);
  const path = useLocation();

  const { userData } = useContext(UserContext);

  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];

  useEffect(() => {
    if (userData && userData.following.find((user) => user === userId)) {
      console.log('first');
      setIsFollowing(true);
    } else {
      console.log('second');
    }
  }, [userData, userId]);
  useEffect(() => {
    axios
      .get('/user/otherUser', { params: { userId } })
      .then((data) => setOtherUserData(data.data));
  }, [userId]);

  const shopProducts = otherUserData?.my_products.filter(
    (item) => item.marketPlace === 'Shop'
  );
  const auctionProducts = otherUserData?.my_products.filter(
    (item) => item.marketPlace === 'Auction'
  );
  const otherUserStats = [
    { text: 'Products', quantity: shopProducts?.length },
    { text: 'Auctions', quantity: auctionProducts?.length },
    { text: 'Followers', quantity: 0 },
  ];
  const followHandler = () => {
    if (userData === null) return;
    if (isFollowing) {
      axios.post('/user/remove-follow', {
        followReceiverId: userId,
        followGiverId: userData._id,
      });
      setIsFollowing(false);
    } else {
      axios.post('/user/add-follow', {
        followReceiverId: userId,
        followGiverId: userData._id,
      });
      setIsFollowing(true);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1900px] flex-col gap-5 p-5 lg:items-center lg:justify-center xl:flex-row">
      <section className="flex w-1/2 basis-1/2 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center rounded p-5 shadow">
          <div>profileImg</div>
          <h6>
            {otherUserData?.credentials.firstName}{' '}
            {otherUserData?.credentials.lastName}
          </h6>
          <p>
            {otherUserData?.address.city}
            {otherUserData?.address.country}
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
            <PrimaryBtn
              type="button"
              usecase="default"
              onClick={followHandler}
              disabled={userData === null}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </PrimaryBtn>
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
                <ProductCard
                  _id={product._id}
                  title={product.title}
                  authors={product.authors}
                  description={product.description}
                  price={product.price}
                  imgs={product.imgs}
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
                  price={item.price}
                  imgs={item.imgs}
                />
              </SwiperSlide>
            ))}
          </ShortSwiper>
        </div>
      </section>
    </div>
  );
}
