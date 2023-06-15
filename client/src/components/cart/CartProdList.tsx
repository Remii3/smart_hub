import { useContext } from 'react';
import { CartContext } from '../../context/CartProvider';
import CartItem from './CartItem';

export default function CartProdList() {
  const {
    cartState,
    incrementDataHandler,
    decrementDataHandler,
    removeCartItemHandler,
  } = useContext(CartContext);

  let ProductsList = <div />;

  const removeItemHandler = async (productId: string) => {
    removeCartItemHandler(productId);
  };

  const incrementCartItemHandler = (productId: string) => {
    incrementDataHandler(productId);
  };

  const decrementCartItemHandler = (productId: string) => {
    decrementDataHandler(productId);
  };

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
            removeCartItemHandler={removeItemHandler}
          />
        ))}
      </ul>
    );
  }
  return <div>{ProductsList}</div>;
}
