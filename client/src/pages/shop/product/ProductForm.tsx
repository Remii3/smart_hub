import { FormEvent, useContext, useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { CartContext } from '@context/CartProvider';
import { Button } from '@components/UI/button';
import LoadingCircle from '@components/Loaders/LoadingCircle';

type ProductFormType = {
  productId?: string;
  productQuantity?: number;
  sold: boolean;
  isEditing: boolean;
};

const defaultProps = {
  productId: '',
  productQuantity: 0,
};

export default function ProductForm({
  productId,
  productQuantity,
  sold,
  isEditing,
}: ProductFormType) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addProductToCart, cartState } = useContext(CartContext);

  let itemCapacity = false;
  let itemBtnCapacity = false;

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productId) {
      addProductToCart({
        productId,
        productQuantity: selectedQuantity,
        type: 'shop',
      });
      setSelectedQuantity(1);
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

  const currentItem = cartState.products.find((product) => {
    return product.productData._id === productId;
  });

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
      {sold && <h4 className="font-bold uppercase text-red-700">Sold out</h4>}
      {!sold && (
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
          <Button
            variant="default"
            type="submit"
            disabled={
              itemBtnCapacity ||
              isEditing ||
              cartState.isAdding === productId ||
              cartState.isDeleting === productId
            }
            className="relative"
          >
            {cartState.isAdding === productId && <LoadingCircle />}
            <span
              className={`${cartState.isAdding === productId && 'invisible'}`}
            >
              Add to cart
              <ShoppingBagIcon
                className="ml-2 inline-block"
                height={24}
                width={24}
              />
            </span>
          </Button>
        </div>
      )}
    </form>
  );
}
ProductForm.defaultProps = defaultProps;
