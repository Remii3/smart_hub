import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CartContext } from '@context/CartProvider';
import { CartProductType } from '@customTypes/interfaces';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';

export default function CartItem({
  productData,
  inCartQuantity,
  totalPrice,
}: CartProductType) {
  const {
    incrementCartItem,
    decrementCartItem,
    removeProductFromCart,
    cartState,
  } = useContext(CartContext);
  if (!productData) return <div />;

  const decrementHandler = () => {
    decrementCartItem(productData._id);
  };

  const incrementHandler = () => {
    incrementCartItem(productData._id);
  };

  const removeHandler = () => {
    removeProductFromCart(productData._id);
  };

  const isBusy =
    cartState.isAdding === productData._id ||
    cartState.isIncrementing === productData._id ||
    cartState.isDecrementing === productData._id ||
    cartState.isDeleting === productData._id ||
    cartState.isLoading;

  return (
    <li className="flex flex-wrap items-center gap-4 ">
      <Link
        to={`/${productData.marketplace}/${productData._id}`}
        className="block overflow-hidden"
      >
        {productData.imgs && productData.imgs[0] ? (
          <img
            src={productData.imgs[0].url}
            alt="Cart product img."
            width={95}
            height={95}
            className="aspect-square rounded-md object-cover"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
            alt="Cart product img placeholder."
            width={95}
            height={95}
            className="aspect-square rounded-md object-cover scale-150"
          />
        )}
      </Link>
      <div className="flex-grow">
        <Link to={`/product/${productData._id}`} className="block">
          <strong className="text-lg text-foreground">
            {productData.title}
          </strong>
        </Link>
        <div className="text-sm text-muted-foreground">
          <span>{totalPrice}</span>
        </div>
      </div>

      <div className="flex flex-grow items-center justify-between gap-3 sm:flex-grow-0 sm:justify-end sm:gap-6">
        <div className="flex items-center">
          <Button
            variant={'ghost'}
            type="button"
            className={`${
              (!(inCartQuantity > 1) || isBusy) && 'text-slate-800'
            } max-h-9 text-base`}
            disabled={!(inCartQuantity > 1) || isBusy}
            onClick={() => decrementHandler()}
            aria-label="Decrement item in your cart."
          >
            -
          </Button>
          <label htmlFor="cartProductQuantity" className="sr-only">
            Quantity
          </label>
          <Input
            type="number"
            min="1"
            max={productData.quantity}
            value={inCartQuantity}
            readOnly
            disabled
            id="cartProductQuantity"
            className="w-[60px] text-center text-foreground [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Button
            variant={'ghost'}
            type="button"
            className={`${
              (inCartQuantity >= productData.quantity || isBusy) &&
              'text-gray-800'
            } max-h-9 text-base`}
            disabled={inCartQuantity >= productData.quantity || isBusy}
            onClick={() => incrementHandler()}
            aria-label="Increment item in your cart."
          >
            +
          </Button>
        </div>

        <Button
          variant={'ghost'}
          type="button"
          className={`${!isBusy && ' hover:text-red-400'} text-red-400`}
          disabled={isBusy}
          onClick={() => removeHandler()}
          aria-label="Remove item from your cart."
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
}
