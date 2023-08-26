import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MainContainer from '../components/UI/SpecialElements/MainContainer';
import { UserContext } from '../context/UserProvider';
import { OrderTypes } from '../types/interfaces';

export default function OrderPage() {
  const [orderData, setOrderData] = useState<OrderTypes | null>(null);
  const [fetchingState, setFetchingState] = useState(false);
  const { userData } = useContext(UserContext);
  const path = useLocation();

  let orderId: string | any[] | null = null;
  orderId = path.pathname.split('/');
  orderId = orderId[orderId.length - 1];

  useEffect(() => {
    setFetchingState(true);
    if (userData?._id && orderId) {
      axios
        .get('/order/one', { params: { userId: userData?._id, orderId } })
        .then((res) => {
          setOrderData(res.data);
          setFetchingState(false);
        })
        .catch(() => setFetchingState(false));
    }
  }, [orderId, userData?._id]);

  if (!orderData && fetchingState) return <div>Loading</div>;

  if (!orderData) return <div>No data</div>;

  return (
    <MainContainer>
      <div>
        <h5>Order: #{orderData._id}</h5>
        <div>
          {orderData.products.map((item) => (
            <Link
              to={`/product/${item.product._id}`}
              key={item.product._id}
              className="mb-4 block space-x-3 rounded-md border-2 border-gray-200 p-3"
            >
              <span>{item.product.title}</span>
              <span>{item.in_cart_quantity}</span>
              <span>{item.total_price}</span>
            </Link>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}
