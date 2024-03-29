import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PopoverClose } from '@radix-ui/react-popover';
import { CartContext } from '@context/CartProvider';
import CartPopupProdList from './CartPopupProdList';
import { Button, buttonVariants } from '@components/UI/button';

function CartPopup() {
  const { cartState } = useContext(CartContext);
  return (
    <>
      <PopoverClose className="absolute end-4 top-4 text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>
        <XMarkIcon className="h-6 w-6" />
      </PopoverClose>

      <div className="mt-4 flex flex-col">
        <CartPopupProdList />
        <div className="space-y-4 min-h-[223px] flex-grow">
          {cartState.cartPrice && (
            <div className="flex justify-end border-t border-gray-100 pt-8">
              <div className="w-screen max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-foreground">
                  <div className="flex justify-between !text-base font-medium">
                    <dt className="text-xl">Total:</dt>
                    <dd className="text-xl">
                      {cartState && cartState.cartPrice}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
          <div className="space-y-4 text-center">
            <PopoverClose asChild>
              <Link
                to="/cart"
                className={`${buttonVariants({
                  variant: 'outline',
                })} w-full py-3`}
              >
                View my cart ({cartState.products?.length || 0})
              </Link>
            </PopoverClose>
            <PopoverClose asChild>
              {cartState.products.length > 0 ? (
                <Link
                  to="/checkout"
                  className={`${buttonVariants({
                    variant: 'default',
                  })} w-full py-3`}
                >
                  Checkout
                </Link>
              ) : (
                <Button
                  variant={'default'}
                  className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium
            text-background shadow-sm transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  disabled
                >
                  Checkout
                </Button>
              )}
            </PopoverClose>

            <PopoverClose asChild>
              <Link
                to="/search"
                className={`${buttonVariants({
                  variant: 'link',
                  size: 'clear',
                })} `}
              >
                Continue shopping
              </Link>
            </PopoverClose>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPopup;
