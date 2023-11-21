import { FormEvent, useContext, useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { CartContext } from '@context/CartProvider';
import { Button } from '@components/UI/button';
import LoadingCircle from '@components/Loaders/LoadingCircle';

type ProductFormType = {
  addToCartHandler: (e: FormEvent<HTMLFormElement>) => void;
  sold: boolean;
  selectedQuantity: number;
  decrementQuantityHandler: () => void;
  productQuantity: number;
  itemCapacity: boolean;
  incrementQuantityHandler: () => void;
  productId: string;
  isEditing: boolean;
  itemBtnCapacity: boolean;
};

export default function CollectionForm({
  addToCartHandler,
  sold,
  selectedQuantity,
  decrementQuantityHandler,
  productQuantity,
  incrementQuantityHandler,
  itemCapacity,
  productId,
  isEditing,
  itemBtnCapacity,
}: ProductFormType) {
  const { cartState } = useContext(CartContext);
  return (
    <form onSubmit={(e) => addToCartHandler(e)}>
      {sold && <h4 className="font-bold uppercase text-red-700">Sold out</h4>}
      {!sold && (
        <div className="flex gap-6">
          <div>
            <button
              type="button"
              className={`${selectedQuantity <= 1 && 'text-slate-300'} px-3`}
              disabled={selectedQuantity <= 1}
              onClick={decrementQuantityHandler}
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              step="1"
              max={productQuantity}
              value={selectedQuantity}
              disabled
              className="h-full rounded-md px-3 py-2 text-center text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className={`${itemCapacity && 'text-slate-300'} px-3`}
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
