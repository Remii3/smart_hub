import axios from 'axios';
import TrashIcon from '../../assets/icons/TrashIcon';

function CartItem() {
  const removeProductHandler = () => {
    axios.post('/account/cart-remove', { test: 'asd' });
  };

  return (
    <li className="flex items-center gap-4">
      <img
        src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
        alt=""
        className="h-16 w-16 rounded object-cover"
      />

      <div>
        <h3 className="text-sm text-gray-900">Basic Tee 6-Pack</h3>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Size:</dt>
            <dd className="inline">XXS</dd>
          </div>

          <div>
            <dt className="inline">Color:</dt>
            <dd className="inline">White</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <form>
          <label htmlFor="Line1Qty" className="sr-only">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value="1"
            id="Line1Qty"
            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
        </form>

        <button
          type="button"
          className="text-gray-600 transition hover:text-red-600"
          onClick={removeProductHandler}
        >
          <span className="sr-only">Remove item</span>

          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

export default CartItem;
