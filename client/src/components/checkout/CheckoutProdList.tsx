import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from '../cart/CartItem';
import { UserContext } from '../../context/UserProvider';

export default function CheckoutProdList() {
  const { cart } = useContext(CartContext);
  const { userData } = useContext(UserContext);

  let productsList = <div></div>;

  if (cart && cart.products) {
    productsList = (
      <ul className="-my-4 divide-y divide-gray-100">
        {cart.products.map((cartProduct) => (
          <CartItem
            key={cartProduct.productData._id}
            productData={cartProduct.productData}
            inCartQuantity={cartProduct.inCartQuantity}
            inCheckout={true}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 rounded-full bg-blue-700" />

        <h2 className="font-medium text-gray-900">
          {userData ? userData.credentials.firstName : 'Guest'}
        </h2>
      </div>

      <div>
        <p className="text-2xl font-medium tracking-tight text-gray-900">
          {cart && cart.cartPrice}
        </p>

        <p className="mt-1 text-sm text-gray-600">For the purchase of</p>
      </div>

      <div>
        <div className="flow-root">{productsList}</div>
      </div>
    </>
  );
}
