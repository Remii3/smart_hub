import { useContext } from 'react';
import { CartContext } from '@context/CartProvider';
import CartPopupItem from './CartPopupItem';

export default function CartPopupProdList() {
  const { cartState } = useContext(CartContext);

  let ProductsList = <div />;

  if (cartState && cartState.products) {
    ProductsList = (
      <ul className="md:max-h-[25vh] max-h-[35vh] space-y-4 overflow-y-auto pr-2 pb-4">
        {cartState.products.map((cartProduct) => (
          <CartPopupItem
            key={cartProduct.productData._id}
            productData={cartProduct.productData}
            inCartQuantity={cartProduct.inCartQuantity}
            totalPrice={cartProduct.totalPrice}
          />
        ))}
      </ul>
    );
  }
  return (
    <div>
      {ProductsList}
      {((cartState && cartState && cartState.products.length < 1) ||
        cartState === null) && <p>No products in cart yet!</p>}
    </div>
  );
}
