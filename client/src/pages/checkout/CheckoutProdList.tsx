import { useContext } from 'react';
import { CartContext } from '@context/CartProvider';
import { UserContext } from '@context/UserProvider';
import CheckoutItem from './CheckoutItem';
import { CartProductTypes } from '@customTypes/interfaces';

export default function CheckoutProdList() {
  const { cartState } = useContext(CartContext);
  const { userData } = useContext(UserContext);

  return (
    <>
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 rounded-full bg-blue-700" />

        <h2 className="font-medium text-gray-900">
          {userData.data
            ? userData.data.user_info.credentials.first_name
            : 'Guest'}
        </h2>
      </div>

      <div>
        <p className="text-2xl font-medium tracking-tight text-gray-900">
          {cartState && cartState.cartPrice}
        </p>

        <p className="mt-1 text-sm text-gray-600">For the purchase of</p>
      </div>

      <div>
        {cartState.products.length < 1 ? (
          <p>No products in cart yet!</p>
        ) : (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-100">
              {cartState.products.map((cartProduct: CartProductTypes) => (
                <CheckoutItem
                  key={cartProduct.productData._id}
                  productData={cartProduct.productData}
                  inCartQuantity={cartProduct.inCartQuantity}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
