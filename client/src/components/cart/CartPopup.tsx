import { Popover } from '@headlessui/react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

function CartPopup() {
  return (
    <div
      className="relative w-screen max-w-sm bg-white px-4 py-8 sm:px-6 lg:px-6"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <Popover.Button className="absolute end-4 top-4 text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Popover.Button>

      <div className="mt-4 space-y-6">
        <ul className="max-h-[396px] space-y-4 overflow-y-auto pr-2">
          <CartItem />
        </ul>

        <div className="space-y-4 text-center">
          <Popover.Button
            as={Link}
            to="/cart"
            className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
          >
            View my cart (2)
          </Popover.Button>

          <Popover.Button
            as={Link}
            to="/checkout"
            className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
          >
            Checkout
          </Popover.Button>

          <Popover.Button
            as={Link}
            to="/"
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
