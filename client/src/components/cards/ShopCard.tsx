import { FormEvent, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@context/CartProvider';
import { CartProductTypes, ProductShopCardType } from '@customTypes/interfaces';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import { Skeleton } from '@components/UI/skeleton';
import StarRating from '@features/rating/StarRating';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

const defaultProps = {
  img: '',
  authors: [],
  description: '',
};

export default function ShopCard({
  _id,
  title,
  authors,
  description,
  price,
  img,
  productQuantity,
  rating,
}: ProductShopCardType) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addProductToCart, cartState } = useContext(CartContext);
  let itemBtnCapacity = false;

  let titleShortened = title;

  if (title.length >= 50) {
    titleShortened = title.slice(0, 50);
    titleShortened = titleShortened.substring(
      0,
      Math.min(titleShortened.length, titleShortened.lastIndexOf(' '))
    );
    titleShortened = `${titleShortened}...`;
  }

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_id) {
      setIsAddingToCart(true);

      addProductToCart({
        productId: _id,
        productQuantity: 1,
      });
      setIsAddingToCart(false);
    }
  };
  const currentItem = cartState.products.find(
    (product: CartProductTypes) => product.productData._id === _id
  );
  if (currentItem) {
    itemBtnCapacity =
      productQuantity! < 1 ||
      currentItem.inCartQuantity + 1 > productQuantity! ||
      false;
  } else {
    itemBtnCapacity = productQuantity! < 1 || false;
  }
  return (
    <div id={`${_id}`} className="relative h-full w-full max-w-[280px]">
      <form
        onSubmit={(e) => addToCartHandler(e)}
        className="flex h-full flex-col justify-between gap-3 rounded-lg bg-background shadow transition duration-200 ease-in-out hover:shadow-md"
      >
        <Link
          to={`/shop/${_id}`}
          aria-label="Show product page"
          className="absolute block h-full w-full rounded-lg indent-0 focus-visible:ring-ring"
        />

        <div>
          <div>
            {img ? (
              <img
                className="h-[160px] w-full rounded-t-lg object-cover"
                src={img}
                alt="product_cover"
                height={760}
                width={760}
              />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                alt="img"
                height={760}
                width={760}
                className="h-[160px] w-full rounded-t-lg object-cover"
              />
            )}
          </div>
          <div className="px-3 pt-3">
            <strong className="m-0 line-clamp-1">{titleShortened}</strong>
            <div className="line-clamp-1 pb-1 text-sm">
              {authors.map((author, id) => (
                <span key={id} className="mr-3">
                  {author.author_info && author.author_info.pseudonim}
                </span>
              ))}
            </div>
            <p className="line-clamp-3 min-h-[72px]">{description}</p>
          </div>
        </div>
        <div className="px-3 pb-3">
          {rating && (
            <div className="pb-1">
              <StarRating showOnly rating={rating.rating ? rating.rating : 0} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-3">
              <h3 className="flex items-center ">${price.toFixed(2)}</h3>
              <Button
                type="submit"
                variant="default"
                disabled={
                  cartState.isAdding === _id ||
                  cartState.isDeleting === _id ||
                  itemBtnCapacity
                }
                className="relative z-20"
              >
                {cartState.isAdding === _id && <LoadingCircle />}
                <div
                  className={`${
                    cartState.isAdding === _id && 'invisible'
                  } space-x-1`}
                >
                  <span className="text-lg">+</span>
                  <ShoppingCartIcon className="inline-block h-6 w-6" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
ShopCard.defaultProps = defaultProps;
