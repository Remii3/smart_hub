import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from './CartItem';

export default function CartProdList() {
  const {
    cartState,
    decrementCartItem,
    incrementCartItem,
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
      <ul className="space-y-4">
        {cartState.cart.products.map((cartProduct) => (
          <CartItem
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
  return <div>{ProductsList}</div>;
}
