import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@context/UserProvider';

export default function OrderHistory() {
  const { userData } = useContext(UserContext);
  if (!userData.data) return <p>Please log in</p>;
  return (
    <div className="px-3">
      <h4 className="mb-4">Order history</h4>
      <div className="px-2">
        {/* {userData.data.orders.map((item) => (
          <Link
            key={item._id}
            to={`order/${item._id}`}
            className="block w-full rounded-md border-2 border-gray-200 p-2"
          >
            {item.createdAt.slice(0, 10)}
            {item.products.map((element) => (
              <div key={element.product._id} className="flex space-x-4">
                <span>{element.product.title}</span>
                <span>x{element.in_cart_quantity}</span>
                <span>{element.total_price}</span>
              </div>
            ))}
          </Link>
        ))} */}
      </div>
    </div>
  );
}
