import { FormEvent, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@context/CartProvider';
import { CartProductTypes, ProductShopCardType } from '@customTypes/interfaces';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import { Skeleton } from '@components/UI/skeleton';

const defaultProps = {
  img: [],
  authors: [],
  description: '',
};
export const SkeletonShopCard = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => {
  return (
    <Skeleton className={`${width} ${height} flex flex-col gap-8 p-3`}>
      <Skeleton className="h-3/5 w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-3/4 md:w-1/2" />
        <Skeleton className="h-3 w-1/2 md:w-1/3" />
        <Skeleton className="h-3 w-1/3 md:w-1/4" />
      </div>
    </Skeleton>
  );
};
export default function ShopCard({
  _id,
  title,
  authors,
  description,
  price,
  img,
  productQuantity,
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
    <div id={`${_id}`} className="mx-auto h-full w-full max-w-[400px]">
      <form
        onSubmit={(e) => addToCartHandler(e)}
        className=" flex h-full flex-col justify-between gap-5 rounded-lg bg-white shadow transition duration-200 ease-in-out hover:shadow-md"
      >
        <div className="flex flex-col gap-3">
          <Link to={`/product/${_id}`}>
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="img"
              className=" w-full rounded-t-lg object-cover"
            />
          </Link>
          <div className="px-3">
            <Link to={`/product/${_id}`}>
              <h6 className="m-0 line-clamp-2 inline-block min-h-[32px] pb-1">
                {titleShortened}
              </h6>
            </Link>
            <div className="line-clamp-1 h-[24px]">
              {authors?.map((author, id) => (
                <span key={id} className="mr-3">
                  {author.author_info && author.author_info.pseudonim}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-3 pb-3">
          <p className="line-clamp-4 min-h-[80px]">{description}</p>
          <div className="flex justify-between gap-3">
            <h4 className="flex items-center">{price}€</h4>
            <div>
              <div className="pb-3">stars</div>
              <Button
                type="submit"
                variant="default"
                disabled={isAddingToCart || itemBtnCapacity}
              >
                <LoadingCircle isLoading={isAddingToCart}>
                  Add to cart
                </LoadingCircle>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
ShopCard.defaultProps = defaultProps;
