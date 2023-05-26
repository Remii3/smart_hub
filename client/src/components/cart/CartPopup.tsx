import { Popover } from '@headlessui/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import { CartContext } from '../../context/CartProvider';
import { CloseIcon } from '../../assets/icons/Icons';

function CartPopup() {
  const { cartProducts } = useContext(CartContext);
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
        <ul className="max-h-[396px] space-y-4 overflow-y-auto pr-2">
          {cartProducts &&
            cartProducts.map((cartProduct) => (
              <CartItem
                key={cartProduct.productData._id}
                productData={cartProduct.productData}
                inCartQuantity={cartProduct.inCartQuantity}
              />
            ))}
          {cartProducts && cartProducts.length < 1 && (
            <p>No products in cart yet!</p>
          )}
        </ul>

        <div className="space-y-4 text-center">
          <Popover.Button
            as={Link}
            to="/cart"
            className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
          >
            View my cart ({cartProducts?.length})
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
