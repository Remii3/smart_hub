import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from './CartItem';

export default function CartPopupProdList() {
  const { cart } = useContext(CartContext);

  let ProductsList = <div />;

  if (cart && cart.products) {
    ProductsList = (
      <ul className="max-h-[396px] space-y-4 overflow-y-auto pr-2">
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
  return (
    <div>
      {ProductsList}
      {((cart && cart.products.length < 1) || cart === null) && (
        <p>No products in cart yet!</p>
      )}
    </div>
  );
}
