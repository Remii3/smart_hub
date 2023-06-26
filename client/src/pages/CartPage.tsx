import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartProvider';
import { TicketIcon } from '../assets/icons/Icons';
import CartProdList from '../components/cart/CartProdList';

export default function CartPage() {
  const { cartState } = useContext(CartContext);
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

          <div className="mt-8">
            <CartProdList />
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
              <div className="w-screen max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{cartState && cartState.cart?.cartPrice}</dd>
                  </div>

                  {false && (
                    <div className="flex justify-between">
                      <dt>VAT</dt>
                      <dd>£25</dd>
                    </div>
                  )}

                  {false && (
                    <div className="flex justify-between">
                      <dt>Discount</dt>
                      <dd>-£20</dd>
                    </div>
                  )}

                  <div className="flex justify-between !text-base font-medium">
                    <dt>Total</dt>
                    <dd>{cartState && cartState.cart?.cartPrice}</dd>
                  </div>
                </dl>

                {false && (
                  <div className="flex justify-end">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700">
                      <TicketIcon height={4} width={4} />

                      <p className="whitespace-nowrap text-xs">
                        2 Discounts Applied
                      </p>
                    </span>
                  </div>
                )}

                <div className="flex justify-end">
                  <Link
                    to="/checkout"
                    className="block rounded bg-primary px-5 py-3 text-sm text-gray-100 transition hover:bg-blue-700"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
