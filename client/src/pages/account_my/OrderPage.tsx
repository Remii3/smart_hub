import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext, useCallback } from 'react';
import MainContainer from '@layout/MainContainer';
import { UserContext } from '@context/UserProvider';
import { OrderTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';

interface OrderType {
  data: OrderTypes | null;
  isLoading: boolean;
}

export default function OrderPage() {
  const [orderData, setOrderData] = useState<OrderType>({
    data: null,
    isLoading: true,
  });
  const { userData } = useContext(UserContext);
  const path = useLocation();

  let orderId: string | any[] | null = null;
  orderId = path.pathname.split('/');
  orderId = orderId[orderId.length - 1];

  const fetchData = useCallback(async () => {
    if (userData.data?._id && orderId) {
      const { data } = await useGetAccessDatabase({
        url: DATABASE_ENDPOINTS.ORDER_ONE,
        params: { userId: userData.data?._id, orderId },
      });
      setOrderData((prevState) => {
        return { ...prevState, data };
      });
    }
  }, [orderId, userData.data?._id]);

  useEffect(() => {
    setOrderData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    fetchData();
    setOrderData((prevState) => {
      return { ...prevState, isLoading: false };
    });
  }, [fetchData]);
  if (!orderData.data && orderData.isLoading) return <div>Loading</div>;

  if (!orderData.data) return <div>No data</div>;

  return (
    <MainContainer>
      <div>
        <h5>Order: #{orderData.data._id}</h5>
        <div>
          {orderData.data.products.map((item) => (
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
