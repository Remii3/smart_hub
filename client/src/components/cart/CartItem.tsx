import { Link } from 'react-router-dom';
import { TrashIcon } from '../../assets/icons/Icons';
import { ProductTypes } from '../../types/interfaces';

type CartItemProps = {
  productData: ProductTypes;
  inCartQuantity: number;
  incrementCartItemHandler: (productId: string) => void;
  decrementCartItemHandler: (productId: string) => void;
  removeCartItemHandler: (productId: string) => void;
};

export default function CartItem({
  productData,
  inCartQuantity,
  incrementCartItemHandler,
  decrementCartItemHandler,
  removeCartItemHandler,
}: CartItemProps) {
  if (!productData) return <div />;

  return (
    <li className="flex items-center gap-4">
      <Link to={`/product/${productData._id}`}>
        <img
          src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
          alt=""
          className="h-16 w-16 rounded object-cover"
        />
      </Link>
      <div>
        <Link to={`/product/${productData._id}`}>
          <h3 className="m-0 text-sm text-gray-900">{productData.title}</h3>
        </Link>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Price:</dt>
            <dd className="inline"> €{productData.price}</dd>
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
              onClick={() => decrementCartItemHandler(productData._id)}
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
              readOnly
              id="Line1Qty"
              className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="px-2"
              onClick={() => incrementCartItemHandler(productData._id)}
            >
              +
            </button>
          </div>
        </form>

        <button
          type="button"
          className="text-gray-600 transition hover:text-red-600"
          onClick={() => removeCartItemHandler(productData._id)}
        >
          <span className="sr-only">Remove item</span>

          <TrashIcon height={4} width={4} />
        </button>
      </div>
    </li>
  );
}
