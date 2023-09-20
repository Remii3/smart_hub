import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PopoverClose } from '@radix-ui/react-popover';
import { CartContext } from '@context/CartProvider';
import CartPopupProdList from './CartPopupProdList';

function CartPopup() {
  const { cartState } = useContext(CartContext);
  return (
    <>
      <PopoverClose className="absolute end-4 top-4 text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>
        <XMarkIcon className="h-6 w-6" />
      </PopoverClose>

      <div className="mt-4 space-y-6">
        <CartPopupProdList />

        <div className="space-y-4 text-center">
          <PopoverClose asChild>
            <Link
              to="/cart"
              className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
            >
              View my cart ({cartState.products?.length || 0})
            </Link>
          </PopoverClose>
          <PopoverClose asChild>
            <Link
              to="/checkout"
              className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium
            text-white shadow-sm transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              Checkout
            </Link>
          </PopoverClose>

          <PopoverClose asChild>
            <Link
              to="/shop"
              className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
            >
              Continue shopping
            </Link>
          </PopoverClose>
        </div>
      </div>
    </>
  );
}

export default CartPopup;
