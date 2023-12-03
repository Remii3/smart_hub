import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from '@context/UserProvider';
import { OrderTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { Card } from '@components/UI/card';
import { buttonVariants } from '@components/UI/button';

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
    <>
      <h5 className="mb-4">Order: #{orderData.data._id}</h5>
      <div className="space-y-4">
        {orderData.data.products.map((item) => (
          <Card
            className="flex items-center justify-between"
            key={item.product._id}
          >
            <div className="flex items-center gap-2">
              <div className="overflow-hidden">
                {item.product.imgs.length > 0 ? (
                  <img
                    src={item.product.imgs[0].url}
                    height={94}
                    width={94}
                    className="aspect-square object-cover rounded-l-md"
                    alt="Product img."
                  />
                ) : (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                    height={94}
                    width={94}
                    alt="Product img."
                    className="aspect-square scale-150 object-cover rounded-l-md"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <Link
                    to={`/product/${item.product._id}`}
                    className={`${buttonVariants({
                      variant: 'link',
                      size: 'clear',
                    })} !justify-start`}
                  >
                    <span className="text-lg line-clamp-1">
                      {item.product.title}
                    </span>
                  </Link>
                </div>
                <div>
                  <Link
                    to={`/account/${item.product.creatorData._id}`}
                    className={`${buttonVariants({
                      variant: 'link',
                      size: 'clear',
                    })} !justify-start`}
                  >
                    <span className="text-muted-foreground line-clamp-1">
                      {item.product.creatorData.pseudonim}
                    </span>
                  </Link>
                </div>
                <span>
                  {item.inCartQuantity} x {item.product.price.value}
                </span>
              </div>
            </div>

            <div className="py-3 pr-4">{item.totalPrice}</div>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-end border-t border-border pt-8">
        <div className="w-screen max-w-lg space-y-4">
          <dl className="space-y-0.5 text-sm text-foreground">
            <div className="flex justify-between !text-base font-medium pr-3">
              <dt className="text-xl">Total:</dt>
              <dd className="text-xl">{orderData.data.orderPrice}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
