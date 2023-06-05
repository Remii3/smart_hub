import axios from 'axios';
import { useContext, useState } from 'react';
import { TrashIcon } from '../../assets/icons/Icons';
import { UserContext } from '../../context/UserProvider';
import { CartContext } from '../../context/CartProvider';
import { ProductTypes } from '../../types/interfaces';
import getCookie from '../../helpers/getCookie';
import { Link } from 'react-router-dom';

type CartItemProps = {
  productData: ProductTypes;
  inCartQuantity: number;
  inCheckout: boolean;
};

function CartItem({ productData, inCartQuantity, inCheckout }: CartItemProps) {
  const { userData } = useContext(UserContext);
  const { fetchCartData } = useContext(CartContext);
  const [currentQuantity, setCurrentQuantity] = useState(inCartQuantity);
  const userId = userData?._id || getCookie('guestToken');

  const removeProductHandler = async () => {
    await axios.post('/cart/cart-remove', {
      userId,
      productId: productData._id,
    });
    fetchCartData();
  };

  const incrementCartItemhandler = async () => {
    await axios.post('cart/cartItem-increment', {
      userId,
      productId: productData._id,
    });
    fetchCartData();
    setCurrentQuantity((prevState) => prevState + 1);
  };

  const decrementCartItemHandler = async () => {
    await axios.post('cart/cartItem-decrement', {
      userId,
      productId: productData._id,
    });
    fetchCartData();
    setCurrentQuantity((prevState) => prevState - 1);
  };

  if (!productData) return <div />;

  return (
    <li className="flex items-center gap-4">
      <Link to={`/product/${productData._id}`}>
        <img
          src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
          alt=""
          className="h-16 w-16 rounded object-cover"
        />
      </Link>
      <div>
        <Link to={`/product/${productData._id}`}>
          <h3 className="m-0 text-sm text-gray-900">{productData.title}</h3>
        </Link>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Price:</dt>
            <dd className="inline"> €{productData.price}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        {inCheckout && (
          <span className="text-lg text-gray-500">x{inCartQuantity}</span>
        )}
        {!inCheckout && (
          <form>
            <div className="flex items-center">
              <button
                type="button"
                className={`${!(currentQuantity > 1) && 'text-gray-300'} px-2`}
                disabled={!(currentQuantity > 1)}
                onClick={() => decrementCartItemHandler()}
              >
                -
              </button>
              <label htmlFor="Line1Qty" className="sr-only">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={currentQuantity}
                readOnly
                id="Line1Qty"
                className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                className="px-2"
                onClick={() => incrementCartItemhandler()}
              >
                +
              </button>
            </div>
          </form>
        )}

        {!inCheckout && (
          <button
            type="button"
            className="text-gray-600 transition hover:text-red-600"
            onClick={removeProductHandler}
          >
            <span className="sr-only">Remove item</span>

            <TrashIcon height={4} width={4} />
          </button>
        )}
      </div>
    </li>
  );
}

export default CartItem;
