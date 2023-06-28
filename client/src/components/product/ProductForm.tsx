import { FormEvent, useContext, useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import { CartContext } from '../../context/CartProvider';

type ProductFormType = {
  productId?: string;
  productQuantity?: number;
};

const defaultProps = {
  productId: '',
  productQuantity: 0,
};

export default function ProductForm({
  productId,
  productQuantity,
}: ProductFormType) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addProductToCart, cartState } = useContext(CartContext);

  let itemCapacity = false;
  let itemBtnCapacity = false;

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartState.cartIsLoading) return;
    if (productId) {
      setIsAddingToCart(true);

      addProductToCart({
        productId,
        productQuantity: selectedQuantity,
      });
      setSelectedQuantity(1);
      setIsAddingToCart(false);
    }
  };

  const incrementQuantityHandler = () => {
    if (productQuantity! <= selectedQuantity) return;
    setSelectedQuantity((prevState) => (prevState += 1));
  };
  const decrementQuantityHandler = () => {
    if (selectedQuantity <= 1) return;
    setSelectedQuantity((prevState) => (prevState -= 1));
  };

  const currentItem = cartState.cart?.products.find(
    (product) => product.productData._id === productId
  );

  if (currentItem) {
    itemCapacity =
      productQuantity! <= selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity >= productQuantity! ||
      false;
    itemBtnCapacity =
      productQuantity! < selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity > productQuantity! ||
      false;
  } else {
    itemCapacity = productQuantity! <= selectedQuantity || false;
    itemBtnCapacity = productQuantity! < selectedQuantity || false;
  }

  return (
    <form className="mt-8" onSubmit={(e) => addToCartHandler(e)}>
      <div className="mt-8 flex gap-4">
        <div>
          <button
            type="button"
            className={`${selectedQuantity <= 1 && 'text-gray-300'} px-2`}
            disabled={selectedQuantity <= 1}
            onClick={decrementQuantityHandler}
          >
            -
          </button>
          <label htmlFor="quantity" className="sr-only">
            Qty
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            step="1"
            max={productQuantity}
            value={selectedQuantity}
            disabled
            className="w-12 rounded border-gray-200 py-3 text-center text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            className={`${itemCapacity && 'text-gray-300'} px-2`}
            disabled={itemCapacity}
            onClick={incrementQuantityHandler}
          >
            +
          </button>
        </div>
        <PrimaryBtn
          type="submit"
          usecase="action"
          textSize="text-sm"
          disabled={isAddingToCart || itemBtnCapacity}
          isLoading={isAddingToCart}
        >
          Add to Cart
          <ShoppingBagIcon className="ml-2 inline-block h-6 w-6" />
        </PrimaryBtn>
      </div>
    </form>
  );
}
ProductForm.defaultProps = defaultProps;
