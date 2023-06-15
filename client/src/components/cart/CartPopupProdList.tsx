import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartPopupItem from './CartPopupItem';

export default function CartPopupProdList() {
  const {
    cartState,
    incrementCartItem,
    decrementCartItem,
    removeProductFromCart,
  } = useContext(CartContext);

  const incrementCartItemHandler = (productId: string) => {
    incrementCartItem(productId);
  };

  const decrementCartItemHandler = (productId: string) => {
    decrementCartItem(productId);
  };

  const removeCartItemHandler = async (productId: string) => {
    removeProductFromCart(productId);
  };

  let ProductsList = <div />;

  if (cartState && cartState.cart?.products) {
    ProductsList = (
      <ul className="max-h-[396px] space-y-4 overflow-y-auto pr-2">
        {cartState.cart.products.map((cartProduct) => (
          <CartPopupItem
            key={cartProduct.productData._id}
            productData={cartProduct.productData}
            inCartQuantity={cartProduct.inCartQuantity}
            incrementCartItemHandler={incrementCartItemHandler}
            decrementCartItemHandler={decrementCartItemHandler}
            removeCartItemHandler={removeCartItemHandler}
          />
        ))}
      </ul>
    );
  }
  return (
    <div>
      {ProductsList}
      {((cartState && cartState.cart && cartState.cart.products.length < 1) ||
        cartState === null) && <p>No products in cart yet!</p>}
    </div>
  );
}
