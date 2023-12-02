import { useContext } from 'react';
import { CartContext } from '@context/CartProvider';
import { UserContext } from '@context/UserProvider';
import CheckoutItem from './CheckoutItem';
import { CartProductType } from '@customTypes/interfaces';

export default function CheckoutProdList() {
  const { cartState } = useContext(CartContext);
  const { userData } = useContext(UserContext);

  return (
    <>
      <div className="flex items-center gap-4">
        <h3>Shop list</h3>
      </div>

      <div>
        <p className="text-2xl font-medium tracking-tight text-gray-900">
          {cartState && cartState.cartPrice}
        </p>

        <span className="text-sm text-muted-foreground">
          For the purchase of
        </span>
      </div>

      <div>
        {cartState.products.length < 1 ? (
          <p>No products in cart yet!</p>
        ) : (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-100">
              {cartState.products.map((cartProduct: CartProductType) => (
                <CheckoutItem
                  key={cartProduct.productData._id}
                  productData={cartProduct.productData}
                  inCartQuantity={cartProduct.inCartQuantity}
                  totalPrice={cartProduct.totalPrice}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
