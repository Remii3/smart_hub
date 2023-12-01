import { FormEvent, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@context/CartProvider';
import { CartProductType, ProductCardTypes } from '@customTypes/interfaces';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button, buttonVariants } from '@components/UI/button';
import StarRating from '@features/rating/StarRating';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { Badge } from '@components/UI/badge';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';

export default function ProductCard({
  _id,
  title,
  authors,
  shortDescription,
  price,
  img,
  productQuantity,
  rating,
  type,
  categories,
}: ProductCardTypes) {
  const { addProductToCart, cartState } = useContext(CartContext);
  let itemBtnCapacity = false;

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addProductToCart({
      productId: _id,
      productQuantity: 1,
    });
  };

  const currentItem = cartState.products.find(
    (product: CartProductType) => product.productData._id === _id
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
        className="flex h-full flex-col justify-between gap-1 rounded-lg bg-background shadow transition duration-200 ease-in-out hover:shadow-md"
      >
        <Link
          to={`/product/${_id}`}
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
            <div className="absolute left-3 top-3">
              <MarketplaceBadge type={type} />
            </div>
          </div>
          <div className="px-3 pt-3">
            <strong className="m-0 line-clamp-1 text-xl">{title}</strong>
            <div className="line-clamp-1 pb-1 text-sm">
              {authors.map((author, id) => (
                <span key={id} className="mr-2 text-sm">
                  {author.author_info && author.author_info.pseudonim}
                </span>
              ))}
            </div>
            <div className="mb-1 line-clamp-3 min-h-[72px]">
              {shortDescription}
            </div>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="mb-1 flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Badge key={category._id} variant={'outline'}>
                {category.label}
              </Badge>
            ))}
          </div>
          <div className="pb-1">
            <StarRating
              showOnly
              rating={rating.avgRating ? rating.avgRating : 0}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="flex basis-[50%] items-center text-4xl">
                {price}
              </h3>
              <Button
                type="submit"
                variant="default"
                disabled={
                  cartState.isAdding === _id ||
                  cartState.isDeleting === _id ||
                  itemBtnCapacity
                }
                className="relative max-h-[40px] flex-grow"
              >
                {cartState.isAdding === _id && <LoadingCircle />}
                <div
                  className={`${
                    cartState.isAdding === _id && 'invisible'
                  } space-x-1`}
                >
                  <span>
                    +
                    <ShoppingCartIcon className="inline-block h-6 w-6" />
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
