import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from './CartItem';

export default function CartProdList() {
  const { cart } = useContext(CartContext);

  let ProductsList = <div />;

  if (cart && cart.products) {
    ProductsList = (
      <ul className="space-y-4">
        {cart.products.map((cartProduct) => (
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
