import { FormEvent, useContext, useState } from 'react';
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { CartContext } from '@context/CartProvider';
import { Button } from '@components/UI/button';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Input } from '@components/UI/input';

type ProductFormType = {
  addToCartHandler: () => void;
  sold: boolean;
  selectedQuantity: number;
  decrementQuantityHandler: () => void;
  productQuantity: number;
  itemCapacity: boolean;
  incrementQuantityHandler: () => void;
  productId: string;
  isEditing: boolean;
  itemBtnCapacity: boolean;
  productPrice: string;
  totalQuantity: number;
  buyNowHandler: () => void;
};

export default function CollectionForm({
  addToCartHandler,
  buyNowHandler,
  sold,
  selectedQuantity,
  decrementQuantityHandler,
  productQuantity,
  incrementQuantityHandler,
  itemCapacity,
  productId,
  isEditing,
  itemBtnCapacity,
  productPrice,
  totalQuantity,
}: ProductFormType) {
  const { cartState } = useContext(CartContext);
  return (
    <>
      {sold && <h4 className="font-bold uppercase text-red-700">Sold out</h4>}
      {!sold && (
        <>
          <span>In stock</span>
          <div>
            <span>{totalQuantity}</span>
            <span className="text-muted-foreground">x</span>
          </div>
          <div className="flex items-center">
            <Button
              variant={'ghost'}
              type="button"
              className={`${
                selectedQuantity <= 1 && 'text-slate-800'
              } max-h-9 text-base`}
              disabled={selectedQuantity <= 1}
              onClick={decrementQuantityHandler}
              aria-label="Decrement item in your cart."
            >
              -
            </Button>
            <label htmlFor="selectedItemQuantity" className="sr-only">
              Selected item quantity
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              max={productQuantity}
              value={selectedQuantity}
              readOnly
              disabled
              id="selectedItemQuantity"
              className="w-[60px] text-center text-foreground [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button
              variant={'ghost'}
              type="button"
              className={`${itemCapacity && 'text-gray-800'} max-h-9 text-base`}
              disabled={itemCapacity}
              onClick={incrementQuantityHandler}
              aria-label="Increment item in your cart."
            >
              +
            </Button>
          </div>
          <h3 className="text-[40px]">{productPrice}</h3>
          <div className="col-span-2 space-y-2">
            <Button
              variant="secondary"
              type="button"
              onClick={addToCartHandler}
              disabled={
                itemBtnCapacity ||
                isEditing ||
                cartState.isAdding === productId ||
                cartState.isDeleting === productId
              }
              className="relative w-full"
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
            <Button
              variant="default"
              type="button"
              onClick={buyNowHandler}
              disabled={
                itemBtnCapacity ||
                isEditing ||
                cartState.isAdding === productId ||
                cartState.isDeleting === productId
              }
              className="relative w-full"
            >
              {cartState.isAdding === productId && <LoadingCircle />}
              <span
                className={`${cartState.isAdding === productId && 'invisible'}`}
              >
                Buy now
                <ShoppingCartIcon
                  className="ml-2 inline-block"
                  height={24}
                  width={24}
                />
              </span>
            </Button>
          </div>
        </>
      )}
    </>
  );
}
