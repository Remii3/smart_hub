import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { ProductTypes } from '../types/interfaces';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import DefaultCard from '../components/card/DefaultCard';
import ProductSwiper from '../components/swiper/ProductSwiper';

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
  const path = useLocation();

  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];

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
  return (
    <div className="mx-auto flex max-w-7xl flex-col px-5 lg:items-center lg:justify-center lg:px-0 xl:flex-row">
      <section className="flex flex-col items-center justify-center">
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
            <PrimaryBtn type="button" usecase="default">
              Follow
            </PrimaryBtn>
          </div>
        </div>
      </section>
      <section className="max-w-7xl">
        <div>
          <h6 className="mb-3">Products</h6>
          <ProductSwiper>
            {shopProducts?.map((item) => (
              <SwiperSlide
                key={item._id}
                style={{ maxWidth: '', margin: '0 auto' }}
              >
                <DefaultCard
                  _id={item._id}
                  title={item.title}
                  authors={item.authors}
                  description={item.description}
                  price={item.price}
                />
              </SwiperSlide>
            ))}
          </ProductSwiper>
        </div>
        <div>
          <h6>Auctions</h6>
          {/* <BasicSwiper> */}
          {/* </BasicSwiper> */}
        </div>
      </section>
    </div>
  );
}
