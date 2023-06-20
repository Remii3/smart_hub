import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from './CartItem';

export default function CartProdList() {
  const { cartState } = useContext(CartContext);

  let ProductsList = <div />;

  if (cartState && cartState.cart?.products) {
    ProductsList = (
      <ul className="space-y-4">
        {cartState.cart.products.map((cartProduct) => (
          <CartItem
            key={cartProduct.productData._id}
            productData={cartProduct.productData}
            inCartQuantity={cartProduct.inCartQuantity}
          />
        ))}
      </ul>
    );
  }
  return <div>{ProductsList}</div>;
}
