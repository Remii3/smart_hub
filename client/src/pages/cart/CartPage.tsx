import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '@context/CartProvider';
import CartProdList from './CartProdList';
import { Button, buttonVariants } from '@components/UI/button';

export default function CartPage() {
  const { cartState, removeProductFromCart } = useContext(CartContext);

  const removeAllCartItemsHandler = () => {
    removeProductFromCart('all');
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Your Cart</h2>
        </header>

        <div className="mt-8">
          <div className="flex justify-end mb-2">
            <Button
              onClick={removeAllCartItemsHandler}
              variant={'outline'}
              className="text-red-400 hover:text-red-400"
              disabled={cartState.products.length <= 0}
            >
              Remove all
            </Button>
          </div>
          <CartProdList />
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
            <div className="w-screen max-w-lg space-y-4">
              <dl className="space-y-0.5 text-sm text-gray-700">
                <div className="flex justify-between !text-base font-medium">
                  <dt className="text-xl">Total:</dt>
                  <dd className="text-xl">
                    {cartState && cartState.cartPrice}
                  </dd>
                </div>
              </dl>

              <div className="flex justify-end">
                {cartState.products.length <= 0 ? (
                  <Button variant={'default'} disabled>
                    Checkout
                  </Button>
                ) : (
                  <Link
                    to="/checkout"
                    className={`${buttonVariants({ variant: 'default' })}`}
                  >
                    Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
