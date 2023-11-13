import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CartProductTypes } from '@customTypes/interfaces';
import { CartContext } from '@context/CartProvider';

export default function CartPopupItem({ productData, inCartQuantity }: CartProductTypes) {
  const { incrementCartItem, decrementCartItem, removeProductFromCart } =
    useContext(CartContext);
  if (!productData) return <div />;

  const decrementHandler = () => {
    decrementCartItem(productData._id, productData.marketplace);
  };

  const incrementHandler = () => {
    incrementCartItem(productData._id, productData.marketplace);
  };
  const removeHandler = () => {
    removeProductFromCart(productData._id, productData.marketplace);
  };

  return (
    <li className="flex items-center gap-4">
      <Link
        to={`/${productData.marketplace}/${productData._id}`}
        className="block"
      >
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
        <Link
          to={`/${productData.marketplace}/${productData._id}`}
          className="block"
        >
          <h3 className="m-0 text-sm text-gray-900">{productData.title}</h3>
        </Link>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <span>{productData.price.value}</span>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <form>
          <div className="flex items-center">
            <button
              type="button"
              className={`${!(inCartQuantity > 1) && 'text-gray-300'} px-2`}
              disabled={!(inCartQuantity > 1)}
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
              value={inCartQuantity}
              max={productData.quantity}
              readOnly
              disabled
              id="Line1Qty"
              className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className={`${
                inCartQuantity >= productData.quantity && 'text-gray-300'
              } px-2`}
              disabled={inCartQuantity >= productData.quantity}
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
