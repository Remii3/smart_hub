import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@context/UserProvider';

export default function OrderHistory() {
  const { userData } = useContext(UserContext);
  return (
    <div>
      <h5>Order history</h5>
      {userData &&
        userData.orders.map((item) => (
          <Link
            key={item._id}
            to={`order/${item._id}`}
            className="block w-full rounded-md border-2 border-gray-200 p-2"
          >
            {item.created_at.slice(0, 10)}
            {item.products.map((element) => (
              <div key={element.product._id} className="flex space-x-4">
                <span>{element.product.title}</span>
                <span>x{element.in_cart_quantity}</span>
                <span>{element.total_price}</span>
              </div>
            ))}
          </Link>
        ))}
    </div>
  );
}
