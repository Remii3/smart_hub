import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CartProductTypes } from '@customTypes/interfaces';
import { CartContext } from '@context/CartProvider';

export default function CartItem({
  productData,
  inCartQuantity,
  productsTotalPrice,
}: CartProductTypes) {
  const [localQuantity, setLocalQuantity] = useState(inCartQuantity);
  const {
    incrementCartItem,
    decrementCartItem,
    removeProductFromCart,
    cartState,
  } = useContext(CartContext);

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
      <Link to={`/shop/${productData._id}`} className="block rounded-md">
        {productData.imgs && productData.imgs[0] ? (
          <img
            src={productData.imgs[0].url}
            alt="product_img"
            className="h-16 w-16 rounded-md object-cover"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
            alt="product_img"
            className="h-16 w-16 rounded-md object-cover"
          />
        )}
      </Link>
      <div>
        <Link to={`/shop/${productData._id}`} className="block">
          <h3 className="m-0 text-sm text-gray-900">{productData.title}</h3>
        </Link>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Price:</dt>
            <dd className="inline">{productData.shop_info.price}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <form>
          <div className="flex items-center">
            <button
              type="button"
              className={`${!(localQuantity > 1) && 'text-gray-300'} px-2`}
              disabled={
                !(localQuantity > 1) ||
                cartState.isDecrementing === productData._id ||
                cartState.isDeleting === productData._id
              }
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
              max={productData.quantity}
              value={localQuantity}
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
              disabled={
                localQuantity >= productData.quantity ||
                cartState.isIncrementing === productData._id ||
                cartState.isDeleting === productData._id
              }
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

          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
