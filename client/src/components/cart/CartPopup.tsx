import { Popover } from '@headlessui/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartProvider';
import { CloseIcon } from '../../assets/icons/Icons';
import CartPopupProdList from './CartPopupProdList';

function CartPopup() {
  const { cartState } = useContext(CartContext);
  return (
    <div
      className="relative w-screen max-w-full bg-white px-6 py-8 sm:px-6 md:max-w-sm lg:px-6"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <Popover.Button className="absolute end-4 top-4 text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>

        <CloseIcon height={5} width={5} />
      </Popover.Button>

      <div className="mt-4 space-y-6">
        <CartPopupProdList />

        <div className="space-y-4 text-center">
          <Popover.Button
            as={Link}
            to="/cart"
            className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
          >
            View my cart ({cartState.cart?.products?.length || 0})
          </Popover.Button>
          <Popover.Button
            as={Link}
            to="/checkout"
            className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium
            text-white shadow-sm transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300"
          >
            Checkout
          </Popover.Button>

          <Popover.Button
            as={Link}
            to="/shop"
            className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
          >
            Continue shopping
          </Popover.Button>
        </div>
      </div>
    </div>
  );
}

export default CartPopup;
