import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CartProductTypes } from '@customTypes/interfaces';
import { CartContext } from '@context/CartProvider';

export default function CartPopupItem({
  productData,
  inCartQuantity,
  productsTotalPrice,
}: CartProductTypes) {
  const [localQuantity, setLocalQuantity] = useState(inCartQuantity);
  const { incrementCartItem, decrementCartItem, removeProductFromCart } =
    useContext(CartContext);
  if (!productData) return <div />;

  const decrementHandler = () => {
    setLocalQuantity((prevState) => prevState - 1);
    decrementCartItem(productData._id);
  };

  const incrementHandler = () => {
    setLocalQuantity((prevState) => prevState + 1);
    incrementCartItem(productData._id);
  };
  const removeHandler = () => {
    removeProductFromCart(productData._id);
  };
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
            <dd className="inline">{productData.shop_info.price}€</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <form>
          <div className="flex items-center">
            <button
              type="button"
              className={`${!(localQuantity > 1) && 'text-gray-300'} px-2`}
              disabled={!(localQuantity > 1)}
              onClick={() => decrementHandler()}
            >
              -
            </button>
            <label htmlFor="Line1Qty" className="sr-only">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={localQuantity}
              max={productData.quantity}
              readOnly
              disabled
              id="Line1Qty"
              className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className={`${
                localQuantity >= productData.quantity && 'text-gray-300'
              } px-2`}
              disabled={localQuantity >= productData.quantity}
              onClick={() => incrementHandler()}
            >
              +
            </button>
          </div>
        </form>

        <button
          type="button"
          className="text-gray-600 transition hover:text-red-600"
          onClick={() => removeHandler()}
        >
          <span className="sr-only">Remove item</span>

          <TrashIcon className="h-1 w-1" />
        </button>
      </div>
    </li>
  );
}
